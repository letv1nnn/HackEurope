"""
Classification API endpoints for MITRE ATT&CK threat intelligence.
Provides SSE streaming and on-demand classification capabilities.
"""

import json
import asyncio
import logging
from typing import AsyncGenerator
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from backend.constants import EventType, SSE_MEDIA_TYPE

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/classification", tags=["classification"])


@router.get("/stream")
async def stream_mitre_classifications(request: Request) -> StreamingResponse:
    """
    SSE endpoint for streaming MITRE ATT&CK classifications.
    
    Returns:
        StreamingResponse: Server-Sent Events stream with classification data
    """
    
    async def classification_generator() -> AsyncGenerator[str, None]:
        """Generate classification events."""
        try:
            while True:
                if await request.is_disconnected():
                    logger.info("Client disconnected from /classification/stream")
                    break
                
                # TODO: Replace with actual classification logic
                demo_data = {
                    "type": EventType.MITRE_CLASSIFICATION,
                    "technique_id": "T1059.004",
                    "technique_name": "Command and Scripting Interpreter: Unix Shell",
                    "severity": "High",
                    "confidence": 0.95
                }
                yield f"data: {json.dumps(demo_data)}\n\n"
                await asyncio.sleep(5)
        except asyncio.CancelledError:
            logger.debug("Classification stream cancelled")
    
    return StreamingResponse(
        classification_generator(),
        media_type=SSE_MEDIA_TYPE,
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

