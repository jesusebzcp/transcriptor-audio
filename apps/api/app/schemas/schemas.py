from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserOut"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    is_active: bool
    is_admin: bool


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    is_active: bool = True
    is_admin: bool = False


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=6)
    is_active: bool | None = None
    is_admin: bool | None = None


class TranscriptionCreate(BaseModel):
    file_name: str
    language: str | None = None
    duration: float | None = None
    model_name: str
    context: str | None = None
    text: str


class TranscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    file_name: str
    language: str | None
    duration: float | None
    model_name: str
    beam_size: int
    vad_filter: bool
    status: str
    error_message: str | None
    context: str | None
    text: str
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None
    processing_time: float | None


LoginResponse.model_rebuild()
