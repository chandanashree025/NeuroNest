from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# User Schemas
class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: Optional[str] = None
    age: Optional[int] = Field(None, ge=1, le=120)
    preferred_language: str = "en"
    role: str = "OLDER_ADULT"  # "OLDER_ADULT" or "CAREGIVER"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    preferred_language: Optional[str] = None
    theme: Optional[str] = None
    profile_photo: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int] = None
    role: str
    profile_photo: Optional[str] = None
    preferred_language: str
    theme: str
    created_at: datetime

    class Config:
        from_attributes = True

# Memory Schemas
class MemoryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    person: Optional[str] = None
    relationship: Optional[str] = None
    date: Optional[str] = None
    description: str
    category: str = "Family"
    photo: Optional[str] = None

class MemoryUpdate(BaseModel):
    title: Optional[str] = None
    person: Optional[str] = None
    relationship: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    photo: Optional[str] = None

class MemoryOut(BaseModel):
    id: str
    user_id: str
    title: str
    person: Optional[str] = None
    relationship: Optional[str] = None
    date: Optional[str] = None
    description: str
    category: str
    photo: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Family Member Schemas
class FamilyMemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    relationship: str
    photo: Optional[str] = None
    description: Optional[str] = None
    important_memories: Optional[str] = None

class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = None
    relationship: Optional[str] = None
    photo: Optional[str] = None
    description: Optional[str] = None
    important_memories: Optional[str] = None

class FamilyMemberOut(BaseModel):
    id: str
    user_id: str
    name: str
    relationship: str
    photo: Optional[str] = None
    description: Optional[str] = None
    important_memories: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Game Result Schemas
class GameResultCreate(BaseModel):
    userId: Optional[str] = None
    game: Optional[str] = None
    gameId: Optional[str] = None
    gameName: Optional[str] = None
    cognitiveSkill: Optional[str] = None
    difficulty: str = "Medium"  # Easy, Medium, Hard
    score: float
    accuracy: float
    mistakes: int = 0
    responseTime: float = 0.0
    timestamp: Optional[str] = None

class GameResultOut(BaseModel):
    id: str
    userId: str
    game: Optional[str] = None
    gameId: str
    gameName: str
    cognitiveSkill: str
    difficulty: str = "Medium"
    score: float
    accuracy: float
    mistakes: int
    responseTime: float
    timestamp: datetime

    class Config:
        from_attributes = True

# Assessment Schemas
class AssessmentCreate(BaseModel):
    memory_score: float
    working_memory_score: float
    attention_score: float
    reasoning_score: float

class AssessmentOut(BaseModel):
    id: str
    user_id: str
    memory_score: float
    working_memory_score: float
    attention_score: float
    reasoning_score: float
    overall_score: float
    suggestions: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

# Conversation / Chat Schemas
class ChatMessageRequest(BaseModel):
    message: str
    language: str = "en"
    patient_id: Optional[str] = None  # if caregiver is chatting about/on behalf of patient

class ChatMessageResponse(BaseModel):
    response: str
    source: str
    language: str
    detected_intent: Optional[str] = None
    context_used: Optional[List[str]] = None

# Settings Schemas
class SettingsUpdate(BaseModel):
    text_size: Optional[str] = None
    high_contrast: Optional[bool] = None
    reduce_animation: Optional[bool] = None
    voice_input_enabled: Optional[bool] = None
    tts_enabled: Optional[bool] = None
    activity_reminders: Optional[bool] = None
    caregiver_notifications: Optional[bool] = None
    memory_permissions: Optional[str] = None

class SettingsOut(BaseModel):
    id: str
    user_id: str
    text_size: str
    high_contrast: bool
    reduce_animation: bool
    voice_input_enabled: bool
    tts_enabled: bool
    activity_reminders: bool
    caregiver_notifications: bool
    memory_permissions: str

    class Config:
        from_attributes = True

# AI Activity Schemas
class AIActivityOut(BaseModel):
    id: str
    user_id: str
    activity_name: str
    observation: str
    reasoning: str
    agent: str
    action: str
    result: str
    learning: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Caregiver Patient link Schemas
class LinkPatientRequest(BaseModel):
    patient_email: str
    relationship: str = "Family Member"

class PatientCardOut(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int]
    profile_photo: Optional[str]
    relationship: str
    recent_activity: Optional[str]
    last_active: Optional[datetime]
    overall_progress: float
    memory_count: int
    games_completed: int

class ProgressSummary(BaseModel):
    overall_score: float
    memory_score: float
    working_memory_score: float
    attention_score: float
    reasoning_score: float
    games_completed: int
    weekly_activity: List[dict]
    recent_games: List[GameResultOut]
    assessment_history: List[AssessmentOut]
