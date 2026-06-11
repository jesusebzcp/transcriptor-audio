# AGENTS.md

## App Shape
- Single-file Streamlit app in `app.py`; Docker starts it with `streamlit run app.py --server.port=8501 --server.address=0.0.0.0`.
- Runtime requires `firebase-key.json` at repo root and `.env` values loaded by `python-dotenv`.

## Commands
- Local run: `streamlit run app.py`
- Docker build: `docker build -t transcriptor-audio .`
- No test, lint, formatter, or typecheck config exists in this repo.

## Environment
- `.env` should define `USUARIOS_PERMITIDOS` as comma-separated emails.
- `CLAVE_MAESTRA` is optional in code but defaults to `proyectos2025`; avoid relying on or exposing that default.
- `firebase-key.json`, `.env`, uploaded media files, `.venv/`, and `__pycache__/` are intentionally gitignored.

## Runtime Gotchas
- FFmpeg is required for audio/video handling; the Dockerfile installs it, but local runs need it installed separately.
- Whisper model size is selected in the Streamlit sidebar; larger models can be slow/heavy.
- Uploaded files are written as temporary `temp_<timestamp>.<ext>` files and removed in `finally`.
