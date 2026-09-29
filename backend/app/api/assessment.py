from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, AssessmentResult
from app.schemas import AssessmentCreate, AssessmentOut
from app.services.agent_orchestrator import evaluate_assessment

router = APIRouter(prefix="/assessment", tags=["Assessment"])

@router.post("", status_code=status.HTTP_201_CREATED)
def submit_assessment(
    data: AssessmentCreate,
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    
    evaluation = evaluate_assessment(
        db=db,
        user_id=target_user_id,
        memory_score=data.memory_score,
        working_memory_score=data.working_memory_score,
        attention_score=data.attention_score,
        reasoning_score=data.reasoning_score
    )

    assessment = AssessmentResult(
        user_id=target_user_id,
        memory_score=data.memory_score,
        working_memory_score=data.working_memory_score,
        attention_score=data.attention_score,
        reasoning_score=data.reasoning_score,
        overall_score=evaluation["overall_score"],
        suggestions=evaluation["suggestions"],
        timestamp=datetime.now(timezone.utc)
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "message": "Assessment recorded successfully",
        "disclaimer": "This activity summary is for personalization and is not a medical diagnosis.",
        "result": {
            "id": assessment.id,
            "userId": assessment.user_id,
            "memoryScore": assessment.memory_score,
            "workingMemoryScore": assessment.working_memory_score,
            "attentionScore": assessment.attention_score,
            "reasoningScore": assessment.reasoning_score,
            "overallScore": assessment.overall_score,
            "suggestions": assessment.suggestions,
            "timestamp": assessment.timestamp.isoformat()
        }
    }

@router.get("/results")
def get_assessment_results(
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    results = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == target_user_id
    ).order_by(AssessmentResult.timestamp.desc()).all()
    
    return [
        {
            "id": r.id,
            "userId": r.user_id,
            "memoryScore": r.memory_score,
            "workingMemoryScore": r.working_memory_score,
            "attentionScore": r.attention_score,
            "reasoningScore": r.reasoning_score,
            "overallScore": r.overall_score,
            "suggestions": r.suggestions,
            "timestamp": r.timestamp.isoformat()
        }
        for r in results
    ]
