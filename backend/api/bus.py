"""
Event bus for broadcasting updates to multiple subscribers.
Implements pub/sub pattern for real-time updates.
"""

import asyncio
import json
import logging
from typing import Set, Dict, Any

logger = logging.getLogger(__name__)


class EventBus:
    """
    Publish-Subscribe event bus for broadcasting messages to multiple subscribers.
    """
    
    def __init__(self):
        """Initialize the event bus."""
        self.subscribers: Set[asyncio.Queue] = set()

    async def subscribe(self) -> asyncio.Queue:
        """
        Subscribe to events.
        
        Returns:
            Queue: Async queue for receiving events
        """
        queue = asyncio.Queue()
        self.subscribers.add(queue)
        logger.debug(f"New subscriber added. Total: {len(self.subscribers)}")
        return queue

    def unsubscribe(self, queue: asyncio.Queue) -> None:
        """
        Unsubscribe from events.
        
        Args:
            queue: The queue to remove
        """
        if queue in self.subscribers:
            self.subscribers.remove(queue)
            logger.debug(f"Subscriber removed. Remaining: {len(self.subscribers)}")

    async def emit(self, data: Dict[str, Any]) -> None:
        """
        Broadcast data to all subscribers.
        
        Args:
            data: Data to broadcast
        """
        if not self.subscribers:
            logger.debug("No active subscribers, skipping broadcast.")
            return
        
        message = f"data: {json.dumps(data)}\n\n"
        
        # Create tasks to avoid blocking if one queue is slow
        tasks = [asyncio.create_task(queue.put(message)) for queue in self.subscribers]
        if tasks:
            await asyncio.wait(tasks)
            logger.debug(f"Broadcasted message to {len(tasks)} subscribers.")

    def get_subscriber_count(self) -> int:
        """Get number of active subscribers."""
        return len(self.subscribers)


# Global instances for the specific streams
dashboard_bus = EventBus()

