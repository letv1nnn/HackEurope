# Data Structure & Organization

## Project Structure

```
HackEurope/
├── backend/                  # FastAPI backend application
│   ├── __init__.py
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration management
│   ├── logger.py            # Logging setup
│   ├── exceptions.py        # Custom exceptions
│   ├── constants.py         # Application constants
│   ├── api/                 # API routes and handlers
│   │   ├── router.py        # Main API router
│   │   ├── classification.py# MITRE classification endpoint
│   │   ├── logs.py          # Honeypot logs endpoint
│   │   ├── fixer.py         # Vulnerability remediation endpoint
│   │   ├── dashboard.py     # Consolidated dashboard endpoint
│   │   ├── bus.py           # Event pub/sub system
│   │   └── __init__.py
│   ├── agents/              # Autonomous agents
│   │   ├── mitre_classifier/# MITRE ATT&CK classification agent
│   │   │   ├── main.py      # Classification logic
│   │   │   ├── env_setup.py # Environment configuration
│   │   │   ├── prompts.py   # LLM prompts
│   │   │   └── data/        # **DEPRECATED** Use root data/ instead
│   │   └── __init__.py
│   ├── core/                # Core business logic
│   └── __init__.py
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── config.js        # Frontend configuration
│   │   ├── constants.js     # Frontend constants
│   │   ├── services/
│   │   │   └── api.js       # API client utilities
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # Component styles
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── .env.example
├── data/                    # **Shared data** (MITRE, honeypot logs)
│   ├── mitre_attack.json    # MITRE ATT&CK framework
│   └── honeypot_logs.json   # Sample honeypot logs
├── scripts/                 # Utility scripts
│   ├── run_mitre_classifier.py
│   ├── start_cowrie.py
│   ├── agent.py
│   └── ...
├── logs/                    # Application logs (gitignored)
│   └── .gitkeep
├── config.py               # Global configuration (if needed)
├── requirements.txt        # Python dependencies
├── docker-compose.yml      # Docker compose configuration
├── .env.example            # Environment variables template
├── .gitignore
└── README.md
```

## Data Files

### Shared Data Files (`/data/`)
- **mitre_attack.json**: MITRE ATT&CK framework data
  - Location: `/home/letv1n/comsci/Projects/HackEurope/data/mitre_attack.json`
  - Used by: Classification agent
  - **Note**: Also exists at `/backend/agents/data/mitre_attack.json` (deprecated - use root data)

- **honeypot_logs.json**: Sample honeypot logs
  - Location: `/home/letv1n/comsci/Projects/HackEurope/data/honeypot_logs.json`
  - Used by: Testing and demos
  - **Note**: Also exists at `/backend/agents/data/honeypot_logs.json` (deprecated - use root data)

### Application Logs (`/logs/`)
- Created at runtime
- Auto-rotates when exceeding 10MB
- Configured via `LOG_FILE` environment variable

## Configuration

### Backend Configuration
- **Primary**: `/backend/config.py` - Centralized settings management
- **Environment**: `.env` file at project root
- **Template**: `.env.example`

Key variables:
```
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=True
GEMINI_API_KEY=your_key_here
LOG_LEVEL=INFO
```

### Frontend Configuration
- **Primary**: `/frontend/src/config.js` - Runtime configuration
- **Environment**: `.env` in frontend directory
- **Template**: `/frontend/.env.example`

Key variables:
```
VITE_API_URL=http://localhost:8000
VITE_SSE_RECONNECT_ATTEMPTS=5
VITE_SSE_RECONNECT_DELAY=1000
```

## Environment Files

- `.env` (root) - Backend and shared configuration (gitignored)
- `.env.example` (root) - Template for backend configuration
- `frontend/.env` - Frontend configuration (gitignored)
- `frontend/.env.example` - Template for frontend configuration

## Logging

All application logging goes through `/backend/logger.py`:
- Console output by default
- Optional file logging (configurable via `LOG_FILE`)
- Automatic log rotation
- Structured format: `%(asctime)s [%(name)s] [%(levelname)s] %(message)s`

## Cleanup Notes

The following directories are deprecated and should not be used:
- `/backend/agents/data/` - Use `/data/` instead
  - `mitre_attack.json`
  - `honeypot_logs.json`

These are kept for backwards compatibility but all code has been updated to prefer the root `/data/` directory.

## Adding New Data Files

1. Place data files in `/data/` directory
2. Reference using `settings.DATA_DIR / "filename.json"` in Python
3. Update `/data/` path references in all modules
4. Document the file format and purpose in this file
