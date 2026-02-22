# Pen Test Agent - HackEurope

A modular, production-ready system for automated honeypot monitoring, AI-powered threat classification, and intelligent vulnerability remediation using MITRE ATT&CK framework and LLM agents.

## 🎯 Features

- **Real-time Honeypot Monitoring**: Stream Cowrie SSH honeypot logs in real-time
- **MITRE ATT&CK Classification**: Automatically classify threats using AI and MITRE framework
- **Smart Vulnerability Remediation**: AI-powered agent suggests and implements fixes
- **Real-time Dashboard**: Server-Sent Events (SSE) for live threat updates
- **Modular Architecture**: Clean separation of concerns for scalability
- **Production-Ready**: Comprehensive logging, error handling, and configuration

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Gemini API Key (for classification)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Setup Backend

```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env
```

### 3. Run Application

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
python backend/main.py
# Backend runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Test Classification

```bash
source .venv/bin/activate
python backend/agents/mitre_classifier/main.py
```

## 📁 Project Structure

```
HackEurope/
├── backend/                    # FastAPI backend
│   ├── main.py                # Application entry
│   ├── config.py              # Configuration management
│   ├── logger.py              # Logging setup
│   ├── constants.py           # Application constants
│   ├── exceptions.py          # Custom exceptions
│   ├── api/                   # API routes
│   │   ├── classification.py  # MITRE classification endpoint
│   │   ├── logs.py            # Honeypot logs endpoint
│   │   ├── fixer.py           # Remediation endpoint
│   │   ├── dashboard.py       # Consolidated dashboard
│   │   └── bus.py             # Event pub/sub system
│   └── agents/                # Autonomous agents
│       └── mitre_classifier/  # MITRE classification agent
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── config.js          # Frontend configuration
│   │   ├── constants.js       # Frontend constants
│   │   ├── services/          # API utilities
│   │   ├── components/        # React components
│   │   └── pages/             # Page views
│   └── package.json
├── data/                      # Shared data files
│   ├── mitre_attack.json      # MITRE framework
│   └── honeypot_logs.json     # Sample logs
├── logs/                      # Application logs
├── scripts/                   # Utility scripts
├── DATA_STRUCTURE.md          # Project organization
├── CONTRIBUTING.md            # Code guidelines
└── requirements.txt           # Python dependencies
```

See [DATA_STRUCTURE.md](DATA_STRUCTURE.md) for detailed organization.

## 🔧 Configuration

### Backend Configuration

Edit `.env` file:

```env
# API
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=True

# LLM
GEMINI_API_KEY=your_api_key_here

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/backend.log
```

See [backend/config.py](backend/config.py) for all available settings.

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_SSE_RECONNECT_ATTEMPTS=5
VITE_SSE_RECONNECT_DELAY=1000
```

## 📡 API Endpoints

### Logs Stream
- **GET** `/api/v1/logs/stream` - Real-time honeypot logs (SSE)

### Classification
- **GET** `/api/v1/classification/stream` - MITRE classifications (SSE)
- **POST** `/api/v1/dashboard/send_honeypot_json` - Send logs for classification

### Remediation
- **GET** `/api/v1/fixing/stream` - Remediation status (SSE)
- **POST** `/api/v1/fixing/remediate` - Trigger remediation

### Dashboard
- **GET** `/api/v1/dashboard/stream` - Consolidated SSE stream

## 🧬 MITRE Classification

The classification agent uses Gemini LLM to analyze honeypot logs and map them to MITRE ATT&CK techniques.

**Quick Test:**
```python
from backend.agents.mitre_classifier.main import classify_logs

# Example logs
logs = [{
    "eventid": "cowrie.login.success",
    "src_ip": "192.168.1.100",
    "username": "root",
    "password": ""
}]

# Classify
results = await classify_logs(logs)
print(results)
```

See [backend/agents/mitre_classifier/main.py](backend/agents/mitre_classifier/main.py) for details.

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 📝 Logging

All logs are centralized through `backend/logger.py`:

- **Console**: Always printed
- **File**: Optional (set `LOG_FILE` in .env)
- **Format**: `%(asctime)s [%(name)s] [%(levelname)s] %(message)s`
- **Rotation**: Automatic at 10MB

```python
from backend.logger import get_logger

logger = get_logger(__name__)
logger.info("Something happened")
logger.error("An error occurred", exc_info=True)
```

## 🛠️ Development

### Code Style & Standards

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Python/JavaScript coding standards
- Type hints and docstrings
- Error handling patterns
- Git commit messages

### Linting

```bash
# Backend
python -m pylint backend/ --fail-under=7.0

# Frontend
npm run lint
```

### Testing

```bash
# Run classification tests
python -m pytest tests/ -v

# Run frontend tests
npm test
```

## 🚨 Error Handling

Custom exceptions in `backend/exceptions.py`:
- `ConfigurationError` - Configuration issues
- `DataNotFoundError` - Missing data files
- `ClassificationError` - Classification failures
- `LLMError` - Gemini API errors
- `RemediationError` - Remediation failures

## 📊 Event Types

The system uses these event types (see `backend/constants.py`):

- `cowrie_log` - Honeypot log entry
- `mitre_classification` - Classification result
- `node_start` / `node_end` - Agent execution
- `fixer_status` - Remediation status
- `error` - Error events

## 🔐 Security

- API keys stored in `.env` (never commit)
- CORS configured for development (restrict in production)
- Input validation on all endpoints
- Logging doesn't include sensitive data

## 📚 Additional Resources

- [DATA_STRUCTURE.md](DATA_STRUCTURE.md) - Project organization & data files
- [CONTRIBUTING.md](CONTRIBUTING.md) - Code style & guidelines
- [SSE_README.md](SSE_README.md) - Server-Sent Events implementation
- [backend/config.py](backend/config.py) - Configuration system
- [backend/agents/mitre_classifier/prompts.py](backend/agents/mitre_classifier/prompts.py) - LLM prompts

## 🐛 Troubleshooting

### "GEMINI_API_KEY not found"
- Add `GEMINI_API_KEY=your_key` to `.env` file
- Restart backend after updating .env

### "MITRE data not found"
- Ensure `data/mitre_attack.json` exists
- Check `backend/config.py` for data directory configuration

### Frontend can't connect to backend
- Verify backend is running on http://localhost:8000
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Classification results are empty
- Check that honeypot logs are properly formatted
- Verify GEMINI_API_KEY is valid
- Check `logs/backend.log` for errors

## 📝 License

[Add your license here]

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📞 Support

[Add support contact information]
