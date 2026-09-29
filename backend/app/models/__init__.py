import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    role = Column(String(20), nullable=False, default="OLDER_ADULT")  # OLDER_ADULT, CAREGIVER
    profile_photo = Column(String(500), nullable=True)
    preferred_language = Column(String(20), default="en")
    theme = Column(String(10), default="light")
    created_at = Column(DateTime, default=get_utc_now)

    # Relationships
    memories = orm_relationship("Memory", back_populates="user", cascade="all, delete-orphan")
    family_members = orm_relationship("FamilyMember", back_populates="user", cascade="all, delete-orphan")
    game_results = orm_relationship("GameResult", back_populates="user", cascade="all, delete-orphan")
    assessment_results = orm_relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    conversations = orm_relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    settings = orm_relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    ai_activities = orm_relationship("AIActivity", back_populates="user", cascade="all, delete-orphan")


class CaregiverPatient(Base):
    __tablename__ = "caregiver_patient"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    caregiver_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    relationship = Column(String(50), nullable=False, default="Family Member")
    created_at = Column(DateTime, default=get_utc_now)


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    relationship = Column(String(50), nullable=False)
    photo = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    important_memories = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="family_members")


class Memory(Base):
    __tablename__ = "memories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    person = Column(String(100), nullable=True)
    relationship = Column(String(50), nullable=True)
    date = Column(String(50), nullable=True)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, default="Family")
    photo = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="memories")


class GameResult(Base):
    __tablename__ = "game_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(String(50), nullable=False)
    game_name = Column(String(100), nullable=False)
    cognitive_skill = Column(String(100), nullable=False)
    difficulty = Column(String(20), nullable=False, default="Medium")  # Easy, Medium, Hard
    score = Column(Float, nullable=False, default=0.0)
    accuracy = Column(Float, nullable=False, default=0.0)
    mistakes = Column(Integer, nullable=False, default=0)
    response_time = Column(Float, nullable=False, default=0.0)
    timestamp = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="game_results")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    memory_score = Column(Float, nullable=False)
    working_memory_score = Column(Float, nullable=False)
    attention_score = Column(Float, nullable=False)
    reasoning_score = Column(Float, nullable=False)
    overall_score = Column(Float, nullable=False)
    suggestions = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="assessment_results")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(20), default="en")
    timestamp = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="conversations")


class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    text_size = Column(String(20), default="normal")
    high_contrast = Column(Boolean, default=False)
    reduce_animation = Column(Boolean, default=False)
    voice_input_enabled = Column(Boolean, default=True)
    tts_enabled = Column(Boolean, default=True)
    activity_reminders = Column(Boolean, default=True)
    caregiver_notifications = Column(Boolean, default=True)
    memory_permissions = Column(String(50), default="Caregivers & Self")

    user = orm_relationship("User", back_populates="settings")


class AIActivity(Base):
    __tablename__ = "ai_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_name = Column(String(100), nullable=False)
    observation = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=False)
    agent = Column(String(50), nullable=False)
    action = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    learning = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=get_utc_now)

    user = orm_relationship("User", back_populates="ai_activities")
