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
    context: str | None
    text: str
    created_at: datetime


LoginResponse.model_rebuild()
