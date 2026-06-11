import logging
import json
from datetime import datetime, timezone

logger = logging.getLogger("app.security")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    logger.addHandler(handler)


def _log(level: str, event: str, **kwargs) -> None:
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "level": level,
        "event": event,
        **kwargs,
    }
    logger.info(json.dumps(payload, ensure_ascii=False))


def log_login_success(email: str, ip: str | None) -> None:
    _log("info", "login_success", email=email, ip=ip)


def log_login_failed(email: str, ip: str | None, reason: str) -> None:
    _log("warning", "login_failed", email=email, ip=ip, reason=reason)


def log_upload_rejected(user_id: int, ip: str | None, reason: str) -> None:
    _log("warning", "upload_rejected", user_id=user_id, ip=ip, reason=reason)


def log_cancel_job(user_id: int, job_id: int, ip: str | None) -> None:
    _log("info", "cancel_job", user_id=user_id, job_id=job_id, ip=ip)


def log_rate_limited(ip: str | None, endpoint: str) -> None:
    _log("warning", "rate_limited", ip=ip, endpoint=endpoint)
