import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

from app.core.config import get_settings
from app.services.whisper import get_whisper_model


@dataclass
class TranscriptionResult:
    text: str
    language: str | None
    duration: float | None


def transcribe_file(
    file_bytes: bytes,
    suffix: str,
    initial_prompt: str | None = None,
) -> TranscriptionResult:
    settings = get_settings()
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    tmp = tempfile.NamedTemporaryFile(
        delete=False, suffix=suffix, dir=str(upload_dir)
    )
    try:
        tmp.write(file_bytes)
        tmp.flush()
        tmp.close()
        path = tmp.name

        model = get_whisper_model(settings)

        segments_iter, info = model.transcribe(
            path,
            beam_size=settings.whisper_beam_size,
            vad_filter=settings.whisper_vad_filter,
            initial_prompt=initial_prompt or None,
        )
        segments = list(segments_iter)

        text = " ".join(seg.text.strip() for seg in segments).strip()
        duration = info.duration if hasattr(info, "duration") else None
        return TranscriptionResult(
            text=text,
            language=info.language,
            duration=duration,
        )
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass
