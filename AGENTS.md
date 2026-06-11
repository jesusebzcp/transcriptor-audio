# AGENTS.md

## Monorepo Layout
- Product name in UI/API docs: `Coding Power`.
- `apps/api` - FastAPI backend (Python 3.11), SQLAlchemy 2 async, Alembic, faster-whisper.
- `apps/web` - Vite + React 19 + TanStack Router admin template (derived from `satnaing/shadcn-admin`).
- `docker-compose.yml` - Postgres + API + Web.

## Auth (env-only)
- No Firebase, no Clerk, no external auth.
- Backend: login posts OAuth2 password form to `/api/v1/auth/login`. Email must be in `AUTH_EMAILS` (comma-separated, case-insensitive) and password must verify against the argon2 hash in `AUTH_PASSWORD_HASH_VALUE`.
- Generate a hash with: `python -c "from passlib.hash import argon2; print(argon2.hash('your-password'))"`.
- In root `.env` used by Docker Compose, escape each `$` in argon2 hashes as `$$`; otherwise Compose interpolates pieces of the hash as variables and auth fails.
- JWT signed with `JWT_SECRET` (HS256), default 60 min expiry. Token is sent as `Authorization: Bearer <token>`.
- Frontend stores the token in a cookie via `useAuthStore` and attaches it to every request through `apps/web/src/lib/api.ts`. `AuthenticatedLayout` redirects to `/sign-in` if the cookie is missing.

## Whisper
- Uses `faster-whisper` (CTranslate2), not openai-whisper. FFmpeg is no longer required at runtime (faster-whisper bundles PyAV), but the API Dockerfile still installs it for safety with edge formats.
- The model is loaded lazily and cached in `apps/api/app/services/whisper.py`. Re-instantiation is triggered only if `WHISPER_MODEL` / `WHISPER_DEVICE` / `WHISPER_COMPUTE_TYPE` change.
- Transcribe call uses `model.transcribe(...)` and the returned `segments` iterator MUST be consumed (e.g. `list(segments_iter)`); otherwise no transcription runs.
- Defaults: `WHISPER_MODEL=small`, `WHISPER_DEVICE=cpu`, `WHISPER_COMPUTE_TYPE=int8`, `WHISPER_BEAM_SIZE=5`, `WHISPER_VAD_FILTER=true`.
- `POST /api/v1/transcriptions` supports per-request `model_name`, `language`, `beam_size`, and `vad_filter`; backend passes these into faster-whisper, not just metadata.

## Database
- Postgres 16. Tables: `users` (auto-created on first login by email) and `transcriptions` (FK to users, cascade delete).
- Async driver is `asyncpg`. Alembic is wired in `apps/api/alembic/env.py` and reads `DATABASE_URL`. The first revision is `apps/api/alembic/versions/0001_initial.py`.
- `lifespan` in `app/main.py` also runs `Base.metadata.create_all` for quick local bring-up; use Alembic for any real change.

## Commands
- API dev: `cd apps/api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- API deps: `pip install -r apps/api/requirements.txt`
- Alembic migration (after schema changes): `cd apps/api && alembic revision --autogenerate -m "msg"` then `alembic upgrade head`.
- Web dev: `cd apps/web && pnpm install && pnpm dev`
- Web build: `cd apps/web && pnpm build` (runs `tsc -b && vite build`).
- Web lint: `cd apps/web && pnpm lint`.
- Full stack (prod): `docker compose up --build` (requires `.env` at repo root; copy from `.env.example`).
- Full stack (dev, live reload): `docker compose -f docker-compose.dev.yml up --build`. API source mounted from `apps/api/app`, web source from `apps/web`. Web runs Vite via `pnpm dev` on port 5173.

## Frontend Notes
- TanStack Router is file-based. Routes live under `apps/web/src/routes`. After adding/removing route files, regenerate the tree with the TanStack Router plugin (or hand-edit `apps/web/src/routeTree.gen.ts` to match the current set: `/`, `/sign-in`, `/transcriptions`).
- `VITE_API_URL` must be set at build time. In Docker it is injected via `docker-compose.yml`; locally create `apps/web/.env` with `VITE_API_URL=http://localhost:8000`.
- `pnpm` is required (template uses `pnpm-lock.yaml`).
- The Clerk, demo dashboards, settings, tasks, users, chats, errors, help-center, apps pages were removed; if you need to add a page, prefer keeping the existing sidebar / layout components.

## API Contract
- `POST /api/v1/auth/login` - OAuth2 form (`username`=email, `password`). Returns `{ access_token, token_type, expires_in, user }`.
- `GET /api/v1/auth/me` - Bearer token required.
- `POST /api/v1/transcriptions` - multipart: `file` (mp3/wav/m4a/mp4), `context?`, `model_name?` (`tiny|base|small|medium|large-v3`), `language?` (`auto|es|en`, default `es`), `beam_size?` (`1..10`, default `5`), `vad_filter?` (default `true`). Returns the saved row.
- `GET /api/v1/transcriptions` - list rows for the current user, newest first.
- `DELETE /api/v1/transcriptions/{id}` - owner-only.

## Operational Gotchas
- `WHISPER_MODEL=large-v3` on CPU is slow; start with `small` or `base` for development.
- Postgres must be reachable before the API starts; compose healthcheck gates the API container.
- Whisper model files cache under `~/.cache/huggingface`; in compose it is mounted on the `whisper_cache` volume to avoid re-downloading.
- CORS allows `http://localhost:5173` and `http://localhost` (nginx-served web). Add new origins in `apps/api/app/main.py` if deploying elsewhere.
- `JWT_SECRET` defaults to `change-me` for local dev only; rotate before any non-local deploy.
