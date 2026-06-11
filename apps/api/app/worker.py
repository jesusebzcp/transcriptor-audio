import asyncio
import os
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.db.bootstrap import ensure_runtime_schema
from app.db.session import Base, SessionLocal, engine
from app.models.models import Transcription
from app.services.transcription import transcribe_path

POLL_SECONDS = float(os.getenv("WORKER_POLL_SECONDS", "3"))
STALE_MINUTES = int(os.getenv("WORKER_STALE_MINUTES", "30"))


async def main() -> None:
    await bootstrap_schema()
    while True:
        await reset_stale_jobs()
        processed = await process_next_job()
        if not processed:
            await asyncio.sleep(POLL_SECONDS)


async def bootstrap_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await ensure_runtime_schema(conn)


async def reset_stale_jobs() -> None:
    stale_before = datetime.now(timezone.utc) - timedelta(minutes=STALE_MINUTES)
    async with SessionLocal() as session:
        result = await session.execute(
            select(Transcription).where(
                Transcription.status == "processing",
                Transcription.started_at < stale_before,
            )
        )
        jobs = result.scalars().all()
        for job in jobs:
            job.status = "queued"
            job.started_at = None
            job.error_message = None
        if jobs:
            await session.commit()


async def process_next_job() -> bool:
    async with SessionLocal() as session:
        async with session.begin():
            result = await session.execute(
                select(Transcription)
                .where(Transcription.status == "queued")
                .order_by(Transcription.created_at.asc())
                .with_for_update(skip_locked=True)
                .limit(1)
            )
            job = result.scalar_one_or_none()
            if job is None:
                return False
            job.status = "processing"
            job.started_at = datetime.now(timezone.utc)
            job.error_message = None
            job_id = job.id

    async with SessionLocal() as session:
        job = await session.get(Transcription, job_id)
        if job is None:
            return True
        try:
            if not job.source_path or not os.path.exists(job.source_path):
                raise FileNotFoundError("No se encontro el archivo fuente")
            result = transcribe_path(
                job.source_path,
                initial_prompt=job.context,
                language=job.language,
                model_name=job.model_name,
                beam_size=job.beam_size,
                vad_filter=job.vad_filter,
            )
            job.text = result.text
            job.language = result.language
            job.duration = result.duration
            job.status = "completed"
            job.completed_at = datetime.now(timezone.utc)
            if job.started_at:
                job.processing_time = (job.completed_at - job.started_at).total_seconds()
            job.error_message = None
        except Exception as exc:  # noqa: BLE001 - persist worker failure for UI
            job.status = "failed"
            job.error_message = str(exc)
            job.completed_at = datetime.now(timezone.utc)
        await session.commit()
    return True


if __name__ == "__main__":
    asyncio.run(main())
