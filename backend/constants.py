"""
Application constants and enums.
"""

from enum import Enum


class EventType(str, Enum):
    """Event types for SSE streaming."""
    COWRIE_LOG = "cowrie_log"
    MITRE_CLASSIFICATION = "mitre_classification"
    NODE_START = "node_start"
    NODE_END = "node_end"
    FIXER_STATUS = "fixer_status"
    ERROR = "error"


class Severity(str, Enum):
    """Threat severity levels."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class Status(str, Enum):
    """Status indicators."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    ERROR = "error"


# API Configuration
API_TITLE = "Pen Test Agent Backend"
API_DESCRIPTION = "Modular backend for honeypot monitoring, threat classification, and AI remediation."
API_VERSION = "1.0.0"

# SSE Configuration
SSE_MEDIA_TYPE = "text/event-stream"
SSE_RECONNECT_DELAY = 2000  # milliseconds

# MITRE ATT&CK Framework defaults
DEFAULT_MITRE_CACHE_TTL = 3600  # seconds

# Logging format
LOG_FORMAT = "%(asctime)s [%(name)s] [%(levelname)s] %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
