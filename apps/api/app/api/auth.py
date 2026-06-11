from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.api.deps import CurrentUser, SessionDep, authenticate
from app.core.logging import log_login_failed, log_login_success
from app.core.rate_limit import limiter
from app.core.security import create_access_token
from app.schemas.schemas import LoginResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    session: SessionDep,
    form: OAuth2PasswordRequestForm = Depends(),
) -> LoginResponse:
    user = await authenticate(form.username, form.password, session)
    ip = request.client.host if request.client else None
    if user is None:
        log_login_failed(form.username, ip, "invalid_credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contrasena incorrectos",
        )
    token, expires_in = create_access_token(user.email)
    log_login_success(user.email, ip)
    return LoginResponse(
        access_token=token, expires_in=expires_in, user=UserOut.model_validate(user)
    )


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)
