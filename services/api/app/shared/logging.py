"""Allowlisted structured access logs, without URL, query or headers."""

import json
import logging

logger = logging.getLogger("arbitral.access")


def record_request(request_id: str, method: str, status: int) -> None:
    logger.info(
        json.dumps(
            {
                "event": "http_request",
                "request_id": request_id,
                "method": method,
                "status": status,
            }
        )
    )


def configure_access_logging() -> None:
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(message)s"))
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False
