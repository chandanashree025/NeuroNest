from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, Conversation, AIActivity
from app.schemas import ChatMessageRequest, ChatMessageResponse, AIActivityOut
from app.services.memory_service import retrieve_user_memories_and_family
from app.services.llm_service import generate_ai_response
from app.services.agent_orchestrator import record_ai_workflow

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_companion(
    data: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = data.patient_id if (data.patient_id and current_user.role == "CAREGIVER") else current_user.id
    target_user = db.query(User).filter(User.id == target_user_id).first() or current_user

    # 1. Retrieve user's stored memories & family records
    memory_context = retrieve_user_memories_and_family(db=db, user_id=target_user_id, query=data.message)

    # 2. Generate grounded response
    result = await generate_ai_response(
        query=data.message,
        user_name=target_user.name,
        language=data.language or target_user.preferred_language or "en",
        memory_context=memory_context
    )

    # 3. Store conversation history
    user_msg = Conversation(
        user_id=target_user_id,
        role="user",
        content=data.message,
        language=data.language,
        timestamp=datetime.now(timezone.utc)
    )
    bot_msg = Conversation(
        user_id=target_user_id,
        role="assistant",
        content=result["response"],
        language=data.language,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(user_msg)
    db.add(bot_msg)
    db.commit()

    # 4. Record trace in AI activities
    record_ai_workflow(
        db=db,
        user_id=target_user_id,
        activity_name="Companion Inquiry & Memory Retrieval",
        observation=f"User asked: '{data.message}' (Language: {data.language})",
        reasoning=f"Intent detected: {result.get('detected_intent', 'conversation')}. Searched personal memory & family profiles.",
        agent=result.get("source", "Companion Agent"),
        action="Formulated strictly grounded, calming response preserving privacy and truthfulness.",
        result="Delivered personalized response to companion interface.",
        learning="User engages actively with family/routine dialogue; maintain gentle, concise pacing."
    )

    return ChatMessageResponse(
        response=result["response"],
        source=result.get("source", "NeuroNest AI"),
        language=result.get("language", data.language),
        detected_intent=result.get("detected_intent"),
        context_used=result.get("context_used")
    )

@router.get("/conversations")
def get_conversations(
    patient_id: Optional[str] = None,
    limit: int = Query(30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    history = db.query(Conversation).filter(
        Conversation.user_id == target_user_id
    ).order_by(Conversation.timestamp.desc()).limit(limit).all()
    
    return [
        {
            "id": c.id,
            "role": c.role,
            "content": c.content,
            "language": c.language,
            "timestamp": c.timestamp.isoformat()
        }
        for c in reversed(history)
    ]

@router.get("/activities", response_model=List[AIActivityOut])
def get_ai_activities(
    patient_id: Optional[str] = None,
    limit: int = Query(30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    return db.query(AIActivity).filter(
        AIActivity.user_id == target_user_id
    ).order_by(AIActivity.timestamp.desc()).limit(limit).all()
