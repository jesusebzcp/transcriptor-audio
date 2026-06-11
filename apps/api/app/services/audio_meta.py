import os
import subprocess
from pathlib import Path


def get_audio_duration(path: str) -> float | None:
    """Return audio duration in seconds using ffprobe."""
    if not os.path.exists(path):
        return None
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                path,
            ],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if result.returncode == 0:
            return float(result.stdout.strip())
    except Exception:
        pass
    return None
