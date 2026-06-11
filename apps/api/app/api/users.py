from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentAdmin, CurrentUser, SessionDep
from app.core.security import hash_password
from app.models.models import User
from app.schemas.schemas import UserCreate, UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
async def list_users(_admin: CurrentAdmin, session: SessionDep) -> list[UserOut]:
    result = await session.execute(select(User).order_by(User.created_at.desc()))
    return [UserOut.model_validate(user) for user in result.scalars().all()]


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    _admin: CurrentAdmin,
    session: SessionDep,
) -> UserOut:
    user = User(
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        is_active=payload.is_active,
        is_admin=payload.is_admin,
    )
    session.add(user)
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese correo",
        )
    await session.refresh(user)
    return UserOut.model_validate(user)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    payload: UserUpdate,
    current_user: CurrentUser,
    _admin: CurrentAdmin,
    session: SessionDep,
) -> UserOut:
    user = await get_user_or_404(user_id, session)
    if payload.email is not None:
        user.email = payload.email.lower()
    if payload.password is not None:
        user.password_hash = hash_password(payload.password)
    if payload.is_active is not None:
        if user.id == current_user.id and payload.is_active is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes desactivar tu propio usuario",
            )
        user.is_active = payload.is_active
    if payload.is_admin is not None:
        if user.id == current_user.id and payload.is_admin is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No puedes quitarte tu propio rol de administrador",
            )
        user.is_admin = payload.is_admin

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un usuario con ese correo",
        )
    await session.refresh(user)
    return UserOut.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: CurrentUser,
    _admin: CurrentAdmin,
    session: SessionDep,
) -> None:
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propio usuario",
        )
    user = await get_user_or_404(user_id, session)
    await session.delete(user)
    await session.commit()


async def get_user_or_404(user_id: int, session: SessionDep) -> User:
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")
    return user
