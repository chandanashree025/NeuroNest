from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import User, UserSettings, Memory, FamilyMember
from app.schemas import UserSignup, UserLogin, Token, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    if data.confirm_password and data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # Ensure role is valid
    role = data.role.upper()
    if role not in ["OLDER_ADULT", "CAREGIVER"]:
        role = "OLDER_ADULT"

    hashed_pw = get_password_hash(data.password)
    new_user = User(
        name=data.name.strip(),
        email=data.email.lower().strip(),
        password_hash=hashed_pw,
        age=data.age,
        role=role,
        preferred_language=data.preferred_language or "en",
        theme="light"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize default settings
    settings = UserSettings(
        user_id=new_user.id,
        text_size="normal",
        high_contrast=False,
        reduce_animation=False,
        voice_input_enabled=True,
        tts_enabled=True,
        activity_reminders=True,
        caregiver_notifications=True
    )
    db.add(settings)

    # If OLDER_ADULT, add a gentle initial sample memory & family member so companion and memories work immediately
    if role == "OLDER_ADULT":
        sample_fm = FamilyMember(
            user_id=new_user.id,
            name="Anitha",
            relationship="Daughter",
            description="Usually visits on Sunday afternoon.",
            important_memories="Always brings warm cardamom tea and loves walking together in the garden."
        )
        sample_mem = Memory(
            user_id=new_user.id,
            title="Sunday Tea in the Garden",
            person="Anitha",
            relationship="Daughter",
            date="Every Sunday",
            description="Anitha visits every Sunday afternoon, bringing fresh tea and sharing stories about family.",
            category="Family"
        )
        db.add(sample_fm)
        db.add(sample_mem)

    db.commit()

    return {
        "message": "Your account has been created successfully. Please log in.",
        "user_id": new_user.id
    }

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower().strip()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
