from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.api.deps import CurrentUser, SessionDep
from app.models.models import Transcription
from app.schemas.schemas import TranscriptionOut
from app.services.transcription import transcribe_file

router = APIRouter(prefix="/transcriptions", tags=["transcriptions"])

ALLOWED_EXT = {"mp3", "wav", "m4a", "mp4"}
ALLOWED_MODELS = {"tiny", "base", "small", "medium", "large-v3"}
ALLOWED_LANGUAGES = {"auto", "es", "en"}


@router.post("", response_model=TranscriptionOut, status_code=status.HTTP_201_CREATED)
async def create_transcription(
    user: CurrentUser,
    session: SessionDep,
    file: UploadFile = File(...),
    context: str | None = Form(default=None),
    model_name: str | None = Form(default=None),
    language: str = Form(default="es"),
    beam_size: int = Form(default=5),
    vad_filter: bool = Form(default=True),
) -> TranscriptionOut:
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no soportado: .{ext}",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="El archivo esta vacio"
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

    result = transcribe_file(
        content,
        suffix=f".{ext}",
        initial_prompt=context,
        language=None if language == "auto" else language,
        model_name=selected_model,
        beam_size=beam_size,
        vad_filter=vad_filter,
    )

    record = Transcription(
        user_id=user.id,
        file_name=filename,
        language=result.language,
        duration=result.duration,
        model_name=selected_model,
        context=context,
        text=result.text,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return TranscriptionOut.model_validate(record)


@router.get("", response_model=list[TranscriptionOut])
async def list_transcriptions(
    user: CurrentUser, session: SessionDep
) -> list[TranscriptionOut]:
    from sqlalchemy import select

    result = await session.execute(
        select(Transcription)
        .where(Transcription.user_id == user.id)
        .order_by(Transcription.created_at.desc())
    )
    return [TranscriptionOut.model_validate(r) for r in result.scalars().all()]


@router.delete("/{transcription_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transcription(
    transcription_id: int, user: CurrentUser, session: SessionDep
) -> None:
    from sqlalchemy import select

    result = await session.execute(
        select(Transcription).where(
            Transcription.id == transcription_id,
            Transcription.user_id == user.id,
        )
    )
    record = result.scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No encontrado")
    await session.delete(record)
    await session.commit()
