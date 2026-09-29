from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import Base, engine, SessionLocal
from app.models import User, UserSettings, Memory, FamilyMember, CaregiverPatient, GameResult, AssessmentResult
from app.core.security import get_password_hash
from app.api import auth, users, memories, family, games, assessment, progress, ai, caregiver, uploads

from sqlalchemy import text

# Create all database tables
Base.metadata.create_all(bind=engine)

# Ensure difficulty column exists in existing database
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE game_results ADD COLUMN difficulty VARCHAR(20) DEFAULT 'Medium'"))
        conn.commit()
    except Exception:
        pass

def seed_demo_data():
    """Seed comfortable initial demo accounts for immediate testing."""
    db = SessionLocal()
    try:
        existing_elder = db.query(User).filter(User.email == "elderly@neuronest.org").first()
        if not existing_elder:
            elder = User(
                name="Ramesh Sharma",
                email="elderly@neuronest.org",
                password_hash=get_password_hash("Welcome123!"),
                age=74,
                role="OLDER_ADULT",
                preferred_language="en",
                theme="light"
            )
            db.add(elder)
            db.commit()
            db.refresh(elder)

            settings = UserSettings(user_id=elder.id)
            db.add(settings)

            # Family member
            fm1 = FamilyMember(
                user_id=elder.id,
                name="Anitha",
                relationship="Daughter",
                description="Usually visits on Sunday afternoon.",
                important_memories="Loves gardening, bringing cardamom tea, and sharing stories about family."
            )
            fm2 = FamilyMember(
                user_id=elder.id,
                name="Arun",
                relationship="Son",
                description="Civil engineer who calls every Wednesday evening from Singapore.",
                important_memories="Always shares cheerful stories of his travels and projects."
            )
            db.add_all([fm1, fm2])

            # Memories
            m1 = Memory(
                user_id=elder.id,
                title="Sunday Tea in the Garden",
                person="Anitha",
                relationship="Daughter",
                date="Every Sunday",
                description="Anitha visits every Sunday afternoon, bringing fresh tea and sharing stories about family.",
                category="Family"
            )
            m2 = Memory(
                user_id=elder.id,
                title="Visit to Mysore Palace",
                person="Family",
                relationship="Family",
                date="October 2021",
                description="A wonderful illuminated evening stroll with children and grandchildren around the grand palace.",
                category="Places"
            )
            m3 = Memory(
                user_id=elder.id,
                title="Morning Walk with Neighbor Rao",
                person="Rao",
                relationship="Friend",
                date="Daily 7:00 AM",
                description="Gentle morning walk around the neighborhood park followed by reading the newspaper.",
                category="Daily Routine"
            )
            db.add_all([m1, m2, m3])

            # Initial gentle game results
            g1 = GameResult(
                user_id=elder.id,
                game_id="memory-match",
                game_name="Memory Match",
                cognitive_skill="Episodic Memory",
                score=100.0,
                accuracy=90.0,
                mistakes=2,
                response_time=24.5
            )
            g2 = GameResult(
                user_id=elder.id,
                game_id="sequence-recall",
                game_name="Sequence Recall",
                cognitive_skill="Working Memory",
                score=85.0,
                accuracy=85.0,
                mistakes=1,
                response_time=18.2
            )
            db.add_all([g1, g2])

            # Assessment
            ass = AssessmentResult(
                user_id=elder.id,
                memory_score=85.0,
                working_memory_score=80.0,
                attention_score=88.0,
                reasoning_score=82.0,
                overall_score=83.8,
                suggestions="Maintain episodic memory through weekly Word Recall exercises • Practice gentle Sequence Recall to support working memory."
            )
            db.add(ass)
            db.commit()

            # Caregiver account
            cg = User(
                name="Priya Sharma",
                email="caregiver@neuronest.org",
                password_hash=get_password_hash("Welcome123!"),
                age=44,
                role="CAREGIVER",
                preferred_language="en",
                theme="light"
            )
            db.add(cg)
            db.commit()
            db.refresh(cg)

            # Link caregiver to patient
            link = CaregiverPatient(
                caregiver_id=cg.id,
                patient_id=elder.id,
                relationship="Father"
            )
            db.add(link)
            db.commit()

    except Exception as e:
        print(f"Seed note: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    seed_demo_data()
    yield
    # Shutdown

app = FastAPI(
    title="NeuroNest API",
    description="Personal Memory & Cognitive Assistance API for older adults and caregivers",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(memories.router)
app.include_router(family.router)
app.include_router(games.router)
app.include_router(assessment.router)
app.include_router(progress.router)
app.include_router(ai.router)
app.include_router(caregiver.router)
app.include_router(uploads.router)

@app.get("/")
def root():
    return {
        "product": "NeuroNest",
        "tagline": "Personal Memory & Cognitive Assistance",
        "status": "healthy",
        "disclaimer": "NeuroNest provides memory and cognitive assistance. It does not replace professional medical care or diagnosis."
    }

@app.get("/health")
def health():
    return {"status": "ok"}
