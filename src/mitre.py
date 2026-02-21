import asyncio
import json
from typing import Optional, Any
from google import genai
from dotenv import load_dotenv
import os
import logging
import re

# -------------------------
# Environment & Logging
# -------------------------

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

logging.basicConfig(
    filename="classification.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logger = logging.getLogger(__name__)

if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in environment variables.")

# -------------------------
# Gemini Client
# -------------------------

client = genai.Client(api_key=GEMINI_API_KEY)

# -------------------------
# Prompts
# -------------------------

SYSTEM_PROMPT = (
    "You are a MITRE ATT&CK classifier.\n"
    "Your task is to analyze security logs and map attacker behavior "
    "to MITRE ATT&CK tactics and techniques.\n\n"
    "CRITICAL OUTPUT RULES:\n"
    "- Return STRICT JSON ONLY\n"
    "- DO NOT use markdown\n"
    "- DO NOT wrap output in ```json\n"
    "- DO NOT include explanations outside JSON\n"
)

# Optional schema locking (HIGHLY recommended)
OUTPUT_SCHEMA = """
Return JSON using EXACT structure:

{
  "event_type": "attack_session",
  "analysis": {
    "summary": string,
    "confidence": "low | medium | high",
    "severity": "low | medium | high | critical"
  },
  "mitre_attack": [
    {
      "tactic_id": string,
      "tactic_name": string,
      "technique_id": string,
      "technique_name": string,
      "evidence": [string]
    }
  ],
  "mitigations": [
    {
      "mitigation_id": string,
      "mitigation_name": string,
      "description": string
    }
  ]
}
"""

# -------------------------
# Utilities
# -------------------------

async def read_from_json(path: str) -> Optional[Any]:
    logger.info(f"Reading {path}")
    try:
        with open(path, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed reading {path}: {e}")
        return None


async def logs_normalization(logs: Any) -> Any:
    """
    Placeholder normalization logic.
    Add ECS / OSSEM rules here later.
    """

    if isinstance(logs, list):
        for event in logs:
            if "timestamp" in event:
                event["timestamp"] = str(event["timestamp"])

    return logs


def clean_llm_json(text: str) -> str:
    """
    Deterministically removes markdown wrappers.
    """

    text = text.strip()

    # Remove ```json or ``` wrappers
    text = re.sub(r"^```json\s*", "", text)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    return text.strip()


# -------------------------
# LLM Classification
# -------------------------

async def classify_with_gemini(logs: Any, mitre_data: Any) -> Optional[dict]:
    logger.info("Calling Gemini classifier")

    logs_str = json.dumps(logs)
    mitre_str = json.dumps(mitre_data)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                SYSTEM_PROMPT +
                OUTPUT_SCHEMA +
                f"\nLOGS:\n{logs_str}\n\n"
                f"MITRE ATT&CK DATA:\n{mitre_str}"
            )
        )

        raw_output = response.text
        logger.info("LLM response received")

        cleaned_output = clean_llm_json(raw_output)

        logger.info("Parsing LLM JSON")
        parsed_json = json.loads(cleaned_output)

        return parsed_json

    except json.JSONDecodeError as e:
        logger.error("JSON parsing failed")
        logger.error(f"Raw LLM output:\n{raw_output}")
        logger.error(f"Error: {e}")
        return None

    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return None


# -------------------------
# Workflow
# -------------------------

async def run_classification_workflow(
    honeypot_logs_path: str,
    mitre_attack_path: str
):
    logger.info("Starting classification workflow")

    honeypot_logs = await read_from_json(honeypot_logs_path)
    mitre_attack = await read_from_json(mitre_attack_path)

    if not honeypot_logs:
        logger.error("Missing honeypot logs")
        return

    if not mitre_attack:
        logger.error("Missing MITRE ATT&CK dataset")
        return

    normalized_logs = await logs_normalization(honeypot_logs)

    classification_result = await classify_with_gemini(
        normalized_logs,
        mitre_attack
    )

    if classification_result:
        logger.info("Classification successful")
        print(json.dumps(classification_result, indent=4))
    else:
        logger.error("Classification failed")


# -------------------------
# Entry Point
# -------------------------

async def main():
    logger.info("MITRE ATT&CK classification program started")

    await run_classification_workflow(
        "data/honeypot_logs.json",
        "data/mitre_attack.json"
    )

    logger.info("Classification workflow completed")


if __name__ == "__main__":
    asyncio.run(main())