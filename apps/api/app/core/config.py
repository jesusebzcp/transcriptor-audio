from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = Field(
        default="postgresql+asyncpg://transcriptor:transcriptor@localhost:5432/transcriptor",
        alias="DATABASE_URL",
    )

    auth_emails: str = Field(default="", alias="AUTH_EMAILS")
    auth_password_hash: str = Field(default="", alias="AUTH_PASSWORD_HASH_VALUE")
    jwt_secret: str = Field(default="change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expires_minutes: int = Field(default=60, alias="JWT_EXPIRES_MINUTES")

    whisper_model: str = Field(default="small", alias="WHISPER_MODEL")
    whisper_device: str = Field(default="cpu", alias="WHISPER_DEVICE")
    whisper_compute_type: str = Field(default="int8", alias="WHISPER_COMPUTE_TYPE")
    whisper_beam_size: int = Field(default=5, alias="WHISPER_BEAM_SIZE")
    whisper_vad_filter: bool = Field(default=True, alias="WHISPER_VAD_FILTER")

    upload_dir: str = Field(default="/tmp/transcriptor-uploads", alias="UPLOAD_DIR")

    @property
    def allowed_emails(self) -> set[str]:
        return {e.strip().lower() for e in self.auth_emails.split(",") if e.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()
