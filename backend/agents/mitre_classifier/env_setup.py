"""
Environment setup for MITRE classifier.
Loads configuration and sets up logging.
"""

import sys
from pathlib import Path

# Add backend to path for imports
project_root = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(project_root))

from backend.config import settings
from backend.logger import setup_logging

# Setup logging
logger = setup_logging(
    name="mitre_classifier",
    level=settings.LOG_LEVEL,
    log_file=settings.LOG_FILE or "classification.log"
)

# Get API key
GEMINI_API_KEY = settings.GEMINI_API_KEY

if not GEMINI_API_KEY:
    logger.error("MITRE Classifier: MISSING API KEY. Gemini will NOT work.")
else:
    logger.info(f"MITRE Classifier: Gemini API key configured")

