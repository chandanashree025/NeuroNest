# NeuroNest

Personal Memory & Cognitive Assistance Platform

## Overview

A full-stack AI-powered healthcare and wellbeing web application designed to provide memory assistance, cognitive activities, personalized support, and caregiver insights for older adults.

## Technology

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

Backend:
- Python
- FastAPI
- SQLite

AI:
- AI Orchestrator
- Cognitive Coach
- Personal Memory Agent
- Companion Agent
- Guardian Agent

## Features

- User authentication
- Older Adult and Caregiver roles
- Cognitive games
- Easy / Medium / Hard difficulty levels across all 7 games:
  1. Memory Match (*Episodic Memory*)
  2. Sequence Recall (*Working Memory*)
  3. Odd One Out (*Attention*)
  4. Pattern Completion (*Reasoning*)
  5. Word Recall (*Verbal Memory*)
  6. Picture Memory (*Visual Memory*)
  7. Number Ordering (*Attention & Reasoning*)
- Cognitive activity assessment
- Personal memory library
- Family member management & photos
- AI Companion with speech synthesis & speech recognition
- Multilingual support (English, Kannada, Hindi, Tamil, Telugu, Malayalam, Bengali, Assamese)
- Progress tracking with daily/weekly domain metrics
- Caregiver insights & patient linking
- Accessibility settings (high contrast, text scaling)
- Light/Dark theme (calm light blue default, deep dark navy)

## Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API**: http://127.0.0.1:8000
- **Swagger Documentation**: http://127.0.0.1:8000/docs
- **ReDoc Documentation**: http://127.0.0.1:8000/redoc

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend Application**: http://127.0.0.1:5173

## Environment Variables

Copy `.env.example` to `.env` and add local credentials:

```bash
cp .env.example .env
```

```env
# NeuroNest Environment Configuration
SECRET_KEY=change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./neuronest.db

# LLM Integration (Optional - intelligent local fallback system operates when empty)
LLM_API_KEY=your_api_key_here
LLM_MODEL=gemini-1.5-flash
LLM_ENDPOINT=
```

Never commit `.env` or real API keys.

## Safety

NeuroNest provides memory and cognitive assistance. It does not replace professional medical care, diagnosis, or clinical advice.
