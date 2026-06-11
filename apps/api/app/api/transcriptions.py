from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    File,
    Form,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)
from fastapi.responses import PlainTextResponse
from sqlalchemy import select

from app.api.deps import CurrentUser, SessionDep
from app.core.config import get_settings
from app.core.logging import log_cancel_job, log_upload_rejected
from app.core.rate_limit import limiter
from app.models.models import Transcription
from app.schemas.schemas import TranscriptionOut
from app.services.audio_meta import get_audio_duration

router = APIRouter(prefix="/transcriptions", tags=["transcriptions"])

ALLOWED_EXT = {"mp3", "wav", "m4a", "mp4"}
ALLOWED_MODELS = {"tiny", "base", "small", "medium", "large-v3"}
ALLOWED_LANGUAGES = {"auto", "es", "en"}
MAX_UPLOAD_BYTES = 200 * 1024 * 1024  # 200 MB
MAX_AUDIO_DURATION = 3600  # 60 minutes


@router.post("", response_model=TranscriptionOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("20/hour")
async def create_transcription(
    request: Request,
    user: CurrentUser,
    session: SessionDep,
    file: UploadFile = File(...),
    context: str | None = Form(default=None),
    model_name: str | None = Form(default=None),
    language: str = Form(default="es"),
    beam_size: int = Form(default=5),
    vad_filter: bool = Form(default=True),
) -> TranscriptionOut:
    ip = request.client.host if request.client else None
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXT:
        log_upload_rejected(user.id, ip, f"unsupported_extension: .{ext}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no soportado: .{ext}",
        )

    content = await file.read()
    if not content:
        log_upload_rejected(user.id, ip, "empty_file")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="El archivo esta vacio"
        )
    if len(content) > MAX_UPLOAD_BYTES:
        log_upload_rejected(user.id, ip, "file_too_large")
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="El archivo excede el limite de 200 MB",
        )

    selected_model = model_name or "small"
    if selected_model not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Modelo no soportado: {selected_model}",
        )
    if language not in ALLOWED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Idioma no soportado: {language}",
        )
    if beam_size < 1 or beam_size > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="beam_size debe estar entre 1 y 10",
        )

    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)
    source_path = upload_dir / f"{uuid4().hex}.{ext}"
    source_path.write_bytes(content)

    duration = get_audio_duration(str(source_path))
    if duration is not None and duration > MAX_AUDIO_DURATION:
        try:
            source_path.unlink(missing_ok=True)
        except OSError:
            pass
        log_upload_rejected(user.id, ip, f"audio_too_long: {duration:.0f}s")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Audio demasiado largo: {duration:.0f}s. Maximo: {MAX_AUDIO_DURATION//60} minutos",
        )

    record = Transcription(
        user_id=user.id,
        file_name=filename,
        language=None if language == "auto" else language,
        duration=duration,
        model_name=selected_model,
        beam_size=beam_size,
        vad_filter=vad_filter,
        status="queued",
        source_path=str(source_path),
        context=context,
        text="",
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return TranscriptionOut.model_validate(record)


@router.get("", response_model=list[TranscriptionOut])
async def list_transcriptions(
    user: CurrentUser, session: SessionDep
) -> list[TranscriptionOut]:
    result = await session.execute(
        select(Transcription)
        .where(Transcription.user_id == user.id)
        .order_by(Transcription.created_at.desc())
    )
    return [TranscriptionOut.model_validate(r) for r in result.scalars().all()]


@router.post("/{transcription_id}/cancel", response_model=TranscriptionOut)
@limiter.limit("30/minute")
async def cancel_transcription(
    request: Request,
    transcription_id: int,
    user: CurrentUser,
    session: SessionDep,
) -> TranscriptionOut:
    ip = request.client.host if request.client else None
    result = await session.execute(
        select(Transcription).where(
            Transcription.id == transcription_id,
            Transcription.user_id == user.id,
        )
    )
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")
    if record.status not in {"queued", "processing"}:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"No se puede cancelar: estado {record.status}",
        )
    record.status = "cancelled"
    record.error_message = None
    await session.commit()
    await session.refresh(record)
    log_cancel_job(user.id, record.id, ip)
    return TranscriptionOut.model_validate(record)


@router.delete("/{transcription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transcription(
    transcription_id: int, user: CurrentUser, session: SessionDep
) -> None:
    result = await session.execute(
        select(Transcription).where(
            Transcription.id == transcription_id,
            Transcription.user_id == user.id,
        )
    )
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")
    if record.source_path:
        try:
            Path(record.source_path).unlink(missing_ok=True)
        except OSError:
            pass
    await session.delete(record)
    await session.commit()


@router.get("/{transcription_id}/download")
async def download_transcription(
    transcription_id: int, user: CurrentUser, session: SessionDep
) -> Response:
    result = await session.execute(
        select(Transcription).where(
            Transcription.id == transcription_id,
            Transcription.user_id == user.id,
        )
    )
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")
    if record.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La transcripcion aun no esta lista",
        )
    filename = Path(record.file_name).stem or "transcripcion"
    return PlainTextResponse(
        record.text,
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}.txt"'},
    )
