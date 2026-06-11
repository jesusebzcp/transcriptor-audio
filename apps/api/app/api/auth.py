from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.api.deps import CurrentUser, SessionDep, authenticate
from app.core.security import create_access_token
from app.schemas.schemas import LoginResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
async def login(
    session: SessionDep,
    form: OAuth2PasswordRequestForm = Depends(),
) -> LoginResponse:
    user = await authenticate(form.username, form.password, session)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contrasena incorrectos",
        )
    token, expires_in = create_access_token(user.email)
    return LoginResponse(
        access_token=token, expires_in=expires_in, user=UserOut.model_validate(user)
    )


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)
