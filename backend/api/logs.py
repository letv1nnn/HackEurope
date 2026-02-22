"""
Logs API endpoints for real-time honeypot log streaming.
Provides SSE streaming of Cowrie honeypot events.
"""

import json
import asyncio
import logging
from typing import AsyncGenerator
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from backend.constants import EventType, SSE_MEDIA_TYPE

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("/stream")
async def stream_cowrie_logs(request: Request) -> StreamingResponse:
    """
    SSE endpoint for streaming real-time Cowrie honeypot logs.
    
    Returns:
        StreamingResponse: Server-Sent Events stream with honeypot logs
    """
    
    async def log_generator() -> AsyncGenerator[str, None]:
        """Generate log events from honeypot."""
        try:
            while True:
                if await request.is_disconnected():
                    logger.info("Client disconnected from /logs/stream")
                    break
                
                # TODO: Replace with actual log reading from honeypot
                demo_data = {
                    "type": EventType.COWRIE_LOG,
                    "eventid": "cowrie.session.connect",
                    "src_ip": "192.168.1.100",
                    "message": "New connection attempt detected",
                    "timestamp": "2026-02-21T16:50:00Z"
                }
                yield f"data: {json.dumps(demo_data)}\n\n"
                await asyncio.sleep(2)
        except asyncio.CancelledError:
            logger.debug("Log stream cancelled")
    
    return StreamingResponse(
        log_generator(),
        media_type=SSE_MEDIA_TYPE,
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

