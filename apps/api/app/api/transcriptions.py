from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.api.deps import CurrentUser, SessionDep
from app.models.models import Transcription
from app.schemas.schemas import TranscriptionOut
from app.services.transcription import transcribe_file

router = APIRouter(prefix="/transcriptions", tags=["transcriptions"])

ALLOWED_EXT = {"mp3", "wav", "m4a", "mp4"}


@router.post("", response_model=TranscriptionOut, status_code=status.HTTP_201_CREATED)
async def create_transcription(
    user: CurrentUser,
    session: SessionDep,
    file: UploadFile = File(...),
    context: str | None = Form(default=None),
    model_name: str | None = Form(default=None),
) -> TranscriptionOut:
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: .{ext}",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file"
        )

    result = transcribe_file(content, suffix=f".{ext}", initial_prompt=context)

    record = Transcription(
        user_id=user.id,
        file_name=filename,
        language=result.language,
        duration=result.duration,
        model_name=model_name or "default",
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    await session.delete(record)
    await session.commit()
