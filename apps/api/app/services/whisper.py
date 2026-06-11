from functools import lru_cache
from threading import Lock

from faster_whisper import WhisperModel

from app.core.config import Settings, get_settings

_lock = Lock()
_model: WhisperModel | None = None
_cached_signature: tuple | None = None


def _signature(settings: Settings) -> tuple:
    return (
        settings.whisper_model,
        settings.whisper_device,
        settings.whisper_compute_type,
    )


def get_whisper_model(settings: Settings | None = None) -> WhisperModel:
    global _model, _cached_signature
    settings = settings or get_settings()
    sig = _signature(settings)
    with _lock:
        if _model is None or _cached_signature != sig:
            _model = WhisperModel(
                settings.whisper_model,
                device=settings.whisper_device,
                compute_type=settings.whisper_compute_type,
            )
            _cached_signature = sig
    return _model


def reset_whisper_model() -> None:
    global _model, _cached_signature
    with _lock:
        _model = None
        _cached_signature = None
