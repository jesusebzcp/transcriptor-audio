from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

from app.core.config import get_settings


async def ensure_runtime_schema(conn: AsyncConnection) -> None:
    await conn.execute(
        text("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(512)")
    )
    await conn.execute(
        text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE")
    )
    await conn.execute(
        text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE")
    )
    await conn.execute(text("UPDATE users SET is_active = TRUE WHERE is_active IS NULL"))
    await conn.execute(text("UPDATE users SET is_admin = FALSE WHERE is_admin IS NULL"))
    await ensure_transcription_queue_schema(conn)
    await bootstrap_env_admins(conn)


async def ensure_transcription_queue_schema(conn: AsyncConnection) -> None:
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS beam_size INTEGER DEFAULT 5")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS vad_filter BOOLEAN DEFAULT TRUE")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'completed'")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS source_path VARCHAR(1024)")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS error_message TEXT")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE")
    )
    await conn.execute(
        text("ALTER TABLE transcriptions ADD COLUMN IF NOT EXISTS processing_time FLOAT")
    )
    await conn.execute(text("UPDATE transcriptions SET beam_size = 5 WHERE beam_size IS NULL"))
    await conn.execute(text("UPDATE transcriptions SET vad_filter = TRUE WHERE vad_filter IS NULL"))
    await conn.execute(text("UPDATE transcriptions SET status = 'completed' WHERE status IS NULL"))
    await conn.execute(
        text("CREATE INDEX IF NOT EXISTS ix_transcriptions_status ON transcriptions (status)")
    )


async def bootstrap_env_admins(conn: AsyncConnection) -> None:
    settings = get_settings()
    if not settings.auth_password_hash:
        return
    for email in settings.allowed_emails:
        await conn.execute(
            text(
                """
                INSERT INTO users (email, password_hash, is_active, is_admin)
                VALUES (:email, :password_hash, TRUE, TRUE)
                ON CONFLICT (email) DO UPDATE
                SET password_hash = CASE
                    WHEN users.password_hash IS NULL OR users.password_hash = ''
                    THEN EXCLUDED.password_hash
                    ELSE users.password_hash
                END,
                is_active = TRUE,
                is_admin = TRUE
                """
            ),
            {"email": email, "password_hash": settings.auth_password_hash},
        )
