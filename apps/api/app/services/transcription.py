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
    language: str | None = None,
    model_name: str | None = None,
    beam_size: int | None = None,
    vad_filter: bool | None = None,
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

        selected_model = model_name or settings.whisper_model
        selected_beam_size = beam_size or settings.whisper_beam_size
        selected_vad_filter = (
            settings.whisper_vad_filter if vad_filter is None else vad_filter
        )
        prompt = build_initial_prompt(initial_prompt, language)

        model = get_whisper_model(settings, selected_model)

        segments_iter, info = model.transcribe(
            path,
            beam_size=selected_beam_size,
            vad_filter=selected_vad_filter,
            language=language or None,
            initial_prompt=prompt,
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


def transcribe_path(
    path: str,
    initial_prompt: str | None = None,
    language: str | None = None,
    model_name: str | None = None,
    beam_size: int | None = None,
    vad_filter: bool | None = None,
) -> TranscriptionResult:
    settings = get_settings()
    selected_model = model_name or settings.whisper_model
    selected_beam_size = beam_size or settings.whisper_beam_size
    selected_vad_filter = settings.whisper_vad_filter if vad_filter is None else vad_filter
    prompt = build_initial_prompt(initial_prompt, language)
    model = get_whisper_model(settings, selected_model)
    segments_iter, info = model.transcribe(
        path,
        beam_size=selected_beam_size,
        vad_filter=selected_vad_filter,
        language=language or None,
        initial_prompt=prompt,
    )
    segments = list(segments_iter)
    text = " ".join(seg.text.strip() for seg in segments).strip()
    duration = info.duration if hasattr(info, "duration") else None
    return TranscriptionResult(text=text, language=info.language, duration=duration)


def build_initial_prompt(context: str | None, language: str | None) -> str | None:
    parts: list[str] = []
    if language == "es":
        parts.append(
            "Transcribe en español. Conserva nombres propios, marcas y términos técnicos."
        )
    elif language == "en":
        parts.append(
            "Transcribe in English. Preserve proper names, brands, and technical terms."
        )
    if context:
        parts.append(f"Contexto y vocabulario importante: {context.strip()}")
    return "\n".join(parts) or None
