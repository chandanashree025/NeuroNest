from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models import AIActivity, GameResult, AssessmentResult, Memory, FamilyMember

def record_ai_workflow(
    db: Session,
    user_id: str,
    activity_name: str,
    observation: str,
    reasoning: str,
    agent: str,
    action: str,
    result: str,
    learning: str
) -> AIActivity:
    """Persist structured multi-agent workflow trace."""
    entry = AIActivity(
        user_id=user_id,
        activity_name=activity_name,
        observation=observation,
        reasoning=reasoning,
        agent=agent,
        action=action,
        result=result,
        learning=learning,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def evaluate_game_performance(
    db: Session,
    user_id: str,
    game_id: str,
    game_name: str,
    cognitive_skill: str,
    difficulty: str,
    score: float,
    accuracy: float,
    mistakes: int,
    response_time: float
) -> Dict[str, Any]:
    """
    OBSERVE -> REASON -> DELEGATE -> COLLABORATE -> ACT -> LEARN
    Evaluates cognitive exercise result deterministically including difficulty progression.
    """
    diff = difficulty.capitalize() if difficulty else "Medium"
    obs = f"User completed {game_name} ({cognitive_skill}) on {diff} difficulty. Score: {score}, Accuracy: {accuracy}%, Mistakes: {mistakes}, Response Time: {response_time:.1f}s."
    
    # Cognitive Coach difficulty recommendation logic
    if diff == "Easy":
        if accuracy >= 80:
            next_difficulty = "Medium"
            reason = f"Excellent mastery on Easy {game_name} ({accuracy}% accuracy). Pacing was confident and steady."
            agent = "Cognitive Coach"
            act = f"Great work on Easy mode! Recommend stepping up to Medium difficulty for an enjoyable next challenge."
            res = "Difficulty recommendation calibrated upwards to Medium."
            learn = f"User is comfortable with {cognitive_skill} basics; ready for Medium difficulty."
        else:
            next_difficulty = "Easy"
            reason = f"Gentle engagement on Easy {game_name} ({accuracy}% accuracy with {mistakes} mistakes)."
            agent = "Cognitive Coach"
            act = f"Recommend continuing on Easy difficulty to strengthen {cognitive_skill} in a relaxing setting."
            res = "Difficulty maintained at Easy for gentle habit building."
            learn = f"Keep {cognitive_skill} tasks at comfortable Easy pacing."
    elif diff == "Medium":
        if accuracy >= 80:
            next_difficulty = "Hard"
            reason = f"Strong proficiency demonstrated on Medium {game_name} ({accuracy}% accuracy). Working rhythm was solid."
            agent = "Cognitive Coach"
            act = f"Impressive performance on Medium! Recommend advancing to Hard difficulty to further stimulate {cognitive_skill}."
            res = "Difficulty recommendation calibrated upwards to Hard."
            learn = f"User thrives on Medium difficulty; test Hard level with supportive pacing."
        elif accuracy < 60:
            next_difficulty = "Easy"
            reason = f"Medium {game_name} proved challenging ({accuracy}% accuracy, {mistakes} mistakes). May indicate cognitive fatigue."
            agent = "Guardian Agent & Cognitive Coach"
            act = f"Activity was a bit challenging today. Recommend returning to Easy difficulty for a relaxing, confidence-building session."
            res = "Difficulty eased to Easy to avoid strain."
            learn = f"Scale back {cognitive_skill} stimulus when fatigue is observed."
        else:
            next_difficulty = "Medium"
            reason = f"Balanced engagement on Medium {game_name} ({accuracy}% accuracy)."
            agent = "Cognitive Coach"
            act = f"Solid session! Recommend continuing on Medium difficulty to maintain steady practice."
            res = "Difficulty maintained at Medium."
            learn = f"Medium difficulty is well-suited for daily {cognitive_skill} routine."
    else:  # Hard
        if accuracy >= 80:
            next_difficulty = "Hard"
            reason = f"Outstanding mastery on Hard {game_name} ({accuracy}% accuracy). Exceptional focus and agility."
            agent = "Cognitive Coach"
            act = f"Superb achievement on Hard difficulty! You are staying sharp and engaged."
            res = "Hard difficulty maintained."
            learn = f"User excels at complex {cognitive_skill} tasks."
        elif accuracy < 65:
            next_difficulty = "Medium"
            reason = f"Performance decreased significantly on Hard {game_name} ({accuracy}% accuracy, {mistakes} mistakes)."
            agent = "Guardian Agent & Cognitive Coach"
            act = f"Hard level was quite demanding today. Recommend returning to Medium difficulty for a balanced, low-stress session."
            res = "Difficulty stepped back to Medium for comfort."
            learn = f"User benefits from Medium level rather than high complexity."
        else:
            next_difficulty = "Hard"
            reason = f"Good perseverance on Hard {game_name} ({accuracy}% accuracy)."
            agent = "Cognitive Coach"
            act = f"Good effort on a challenging task! Continue on Hard or switch to Medium whenever you prefer a lighter pace."
            res = "Hard difficulty retained with option for lighter pace."
            learn = f"Consistent effort observed on Hard level."

    # Next game recommendation
    if accuracy >= 80:
        next_game = "Pattern Completion" if "Memory" in cognitive_skill else "Memory Match"
        next_reason = f"To stimulate complementary cognitive skills."
    else:
        next_game = "Picture Memory"
        next_reason = "Gentle visual exploration to restore confidence."

    record_ai_workflow(
        db=db,
        user_id=user_id,
        activity_name=f"{game_name} ({diff}) Session Review",
        observation=obs,
        reasoning=reason,
        agent=agent,
        action=act,
        result=res,
        learning=learn
    )
    
    return {
        "next_game": next_game,
        "next_difficulty": next_difficulty,
        "recommendation_reason": next_reason,
        "coach_note": act
    }


def evaluate_assessment(
    db: Session,
    user_id: str,
    memory_score: float,
    working_memory_score: float,
    attention_score: float,
    reasoning_score: float
) -> Dict[str, Any]:
    """
    Evaluate 4-domain cognitive assessment and generate non-diagnostic personalized suggestions.
    """
    overall = round((memory_score + working_memory_score + attention_score + reasoning_score) / 4.0, 1)
    
    suggestions: List[str] = []
    
    # Domain specific suggestions
    if memory_score < 70:
        suggestions.append("Spend 10 minutes reviewing Family Memories and playing Memory Match.")
    else:
        suggestions.append("Maintain strong episodic memory through weekly Word Recall exercises.")
        
    if working_memory_score < 70:
        suggestions.append("Try daily gentle Sequence Recall to strengthen working memory retention.")
    else:
        suggestions.append("Working memory retention is strong; practice 5-digit number ordering.")
        
    if attention_score < 70:
        suggestions.append("Practice focused attention with 'Odd One Out' in quiet, well-lit spaces.")
    else:
        suggestions.append("Excellent visual attention; continue daily exploration games.")
        
    if reasoning_score < 70:
        suggestions.append("Enjoy relaxing Pattern Completion puzzles to support logical reasoning.")
    else:
        suggestions.append("Great problem-solving agility on pattern sequence puzzles.")

    joined_suggestions = " • " + " • ".join(suggestions)
    
    obs = f"Assessment completed across 4 domains. Memory: {memory_score}%, Working Memory: {working_memory_score}%, Attention: {attention_score}%, Reasoning: {reasoning_score}%. Overall: {overall}%."
    reason = "Comprehensive cognitive profile mapped for personalized activity recommendation."
    agent = "AI Orchestrator & Cognitive Coach"
    act = "Personalized routine formulated emphasizing lower-scoring domains with gentle pacing."
    res = f"Recommendations dispatched to User Dashboard. Overall activity index: {overall}%."
    learn = "Baseline profile established to dynamically tune daily game recommendations."

    record_ai_workflow(
        db=db,
        user_id=user_id,
        activity_name="Comprehensive Cognitive Assessment",
        observation=obs,
        reasoning=reason,
        agent=agent,
        action=act,
        result=res,
        learning=learn
    )

    return {
        "overall_score": overall,
        "suggestions": joined_suggestions
    }


def generate_caregiver_insights_summary(db: Session, patient_id: str) -> Dict[str, Any]:
    """
    Generate non-diagnostic caregiver overview and activity trends.
    """
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    recent_games: List[GameResult] = db.query(GameResult).filter(
        GameResult.user_id == patient_id,
        GameResult.timestamp >= seven_days_ago
    ).all()
    
    recent_assessments: List[AssessmentResult] = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == patient_id
    ).order_by(AssessmentResult.timestamp.desc()).limit(3).all()

    memories_count = db.query(Memory).filter(Memory.user_id == patient_id).count()
    family_count = db.query(FamilyMember).filter(FamilyMember.user_id == patient_id).count()

    skills_played = {}
    for g in recent_games:
        skills_played[g.cognitive_skill] = skills_played.get(g.cognitive_skill, 0) + 1

    insights: List[str] = []
    
    if len(recent_games) == 0:
        insights.append("No cognitive games completed in the past 7 days. Gentle encouragement to try a 5-minute Memory Match session may help.")
    else:
        insights.append(f"Completed {len(recent_games)} cognitive activities this week.")
        
        # Check skill distribution
        if "Working Memory" not in skills_played or skills_played.get("Working Memory", 0) <= 1:
            insights.append("Recent activity shows lower participation in working-memory activities. Consider encouraging a short memory session.")
        else:
            insights.append("Great consistency with working-memory exercises this week.")
            
        if "Attention" in skills_played:
            insights.append("Visual attention activities show positive, steady engagement.")

    if memories_count < 3:
        insights.append("Adding more photos and descriptions to the Memory Library can enrich daily recall conversations with NeuroNest.")

    return {
        "total_recent_games": len(recent_games),
        "recent_assessments_count": len(recent_assessments),
        "memories_count": memories_count,
        "family_count": family_count,
        "skills_distribution": skills_played,
        "insights": insights
    }
