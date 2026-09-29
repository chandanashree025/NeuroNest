from typing import Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, GameResult, AssessmentResult

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("")
def get_progress_data(
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    
    # Fetch all game results for user
    game_results = db.query(GameResult).filter(GameResult.user_id == target_user_id).all()
    # Fetch all assessment results
    assessment_results = db.query(AssessmentResult).filter(AssessmentResult.user_id == target_user_id).order_by(AssessmentResult.timestamp.desc()).all()
    
    # Calculate skill metrics
    skill_accs = {
        "Memory": [],
        "Working Memory": [],
        "Attention": [],
        "Reasoning": []
    }
    
    for g in game_results:
        skill = g.cognitive_skill
        if "Working" in skill:
            skill_accs["Working Memory"].append(g.accuracy)
        elif "Memory" in skill or "Verbal" in skill or "Visual" in skill or "Episodic" in skill:
            skill_accs["Memory"].append(g.accuracy)
        elif "Attention" in skill and "Reasoning" in skill:
            skill_accs["Attention"].append(g.accuracy)
            skill_accs["Reasoning"].append(g.accuracy)
        elif "Attention" in skill:
            skill_accs["Attention"].append(g.accuracy)
        elif "Reasoning" in skill:
            skill_accs["Reasoning"].append(g.accuracy)
            
    # If assessments exist, blend them
    if assessment_results:
        latest = assessment_results[0]
        skill_accs["Memory"].append(latest.memory_score)
        skill_accs["Working Memory"].append(latest.working_memory_score)
        skill_accs["Attention"].append(latest.attention_score)
        skill_accs["Reasoning"].append(latest.reasoning_score)

    def avg(lst, default=75.0):
        return round(sum(lst) / len(lst), 1) if lst else default

    mem_score = avg(skill_accs["Memory"], 80.0)
    wm_score = avg(skill_accs["Working Memory"], 75.0)
    att_score = avg(skill_accs["Attention"], 82.0)
    reas_score = avg(skill_accs["Reasoning"], 78.0)
    overall_score = round((mem_score + wm_score + att_score + reas_score) / 4.0, 1)

    # 7-day daily activity
    now = datetime.now(timezone.utc)
    weekly_activity = []
    days_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for i in range(6, -1, -1):
        day_date = now - timedelta(days=i)
        day_start = day_date.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        count = sum(1 for g in game_results if day_start <= g.timestamp.replace(tzinfo=timezone.utc) <= day_end)
        weekly_activity.append({
            "day": day_date.strftime("%a"),
            "date": day_date.strftime("%b %d"),
            "activities": count
        })

    recent_games = [
        {
            "id": g.id,
            "userId": g.user_id,
            "game": g.game_name,
            "gameId": g.game_id,
            "gameName": g.game_name,
            "cognitiveSkill": g.cognitive_skill,
            "difficulty": getattr(g, "difficulty", "Medium"),
            "score": g.score,
            "accuracy": g.accuracy,
            "mistakes": g.mistakes,
            "responseTime": g.response_time,
            "timestamp": g.timestamp.isoformat()
        }
        for g in sorted(game_results, key=lambda x: x.timestamp, reverse=True)[:10]
    ]

    return {
        "overallScore": overall_score,
        "memoryScore": mem_score,
        "workingMemoryScore": wm_score,
        "attentionScore": att_score,
        "reasoningScore": reas_score,
        "gamesCompleted": len(game_results),
        "assessmentsCompleted": len(assessment_results),
        "weeklyActivity": weekly_activity,
        "recentGames": recent_games,
        "latestAssessment": {
            "overallScore": assessment_results[0].overall_score,
            "suggestions": assessment_results[0].suggestions,
            "timestamp": assessment_results[0].timestamp.isoformat()
        } if assessment_results else None
    }
