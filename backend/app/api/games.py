from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, GameResult
from app.schemas import GameResultCreate, GameResultOut
from app.services.agent_orchestrator import evaluate_game_performance

router = APIRouter(prefix="/games", tags=["Games"])

GAME_SKILL_MAP = {
    "memory-match": "Episodic Memory",
    "sequence-recall": "Working Memory",
    "odd-one-out": "Attention",
    "pattern-completion": "Reasoning",
    "word-recall": "Verbal Memory",
    "picture-memory": "Visual Memory",
    "number-ordering": "Attention & Reasoning"
}

@router.post("/results", status_code=status.HTTP_201_CREATED)
def submit_game_result(
    data: GameResultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = data.userId if (data.userId and current_user.role == "CAREGIVER") else current_user.id
    
    # Resolve game identifier and skill
    resolved_name = data.gameName or data.game or "Cognitive Activity"
    resolved_id = data.gameId or (data.game.lower().replace(" ", "-") if data.game else "activity")
    resolved_skill = data.cognitiveSkill or GAME_SKILL_MAP.get(resolved_id, "Cognitive Skill")
    resolved_diff = data.difficulty.capitalize() if data.difficulty else "Medium"

    entry = GameResult(
        user_id=target_user_id,
        game_id=resolved_id,
        game_name=resolved_name,
        cognitive_skill=resolved_skill,
        difficulty=resolved_diff,
        score=data.score,
        accuracy=data.accuracy,
        mistakes=data.mistakes,
        response_time=data.responseTime,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Evaluate with Cognitive Coach / AI Agent Orchestrator
    ai_evaluation = evaluate_game_performance(
        db=db,
        user_id=target_user_id,
        game_id=resolved_id,
        game_name=resolved_name,
        cognitive_skill=resolved_skill,
        difficulty=resolved_diff,
        score=data.score,
        accuracy=data.accuracy,
        mistakes=data.mistakes,
        response_time=data.responseTime
    )

    return {
        "message": "Game result recorded successfully",
        "result": {
            "id": entry.id,
            "userId": entry.user_id,
            "game": entry.game_name,
            "gameId": entry.game_id,
            "gameName": entry.game_name,
            "cognitiveSkill": entry.cognitive_skill,
            "difficulty": entry.difficulty,
            "score": entry.score,
            "accuracy": entry.accuracy,
            "mistakes": entry.mistakes,
            "responseTime": entry.response_time,
            "timestamp": entry.timestamp.isoformat()
        },
        "aiRecommendation": ai_evaluation
    }

@router.get("/results")
def get_game_results(
    limit: int = Query(50, ge=1, le=200),
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    results = db.query(GameResult).filter(
        GameResult.user_id == target_user_id
    ).order_by(GameResult.timestamp.desc()).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "userId": r.user_id,
            "game": r.game_name,
            "gameId": r.game_id,
            "gameName": r.game_name,
            "cognitiveSkill": r.cognitive_skill,
            "difficulty": getattr(r, "difficulty", "Medium"),
            "score": r.score,
            "accuracy": r.accuracy,
            "mistakes": r.mistakes,
            "responseTime": r.response_time,
            "timestamp": r.timestamp.isoformat()
        }
        for r in results
    ]
