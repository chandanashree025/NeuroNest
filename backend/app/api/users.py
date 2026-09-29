from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, UserSettings
from app.schemas import UserOut, UserUpdate, PasswordChange, SettingsOut, SettingsUpdate
from app.core.security import verify_password, get_password_hash

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.name is not None:
        current_user.name = data.name.strip()
    if data.age is not None:
        current_user.age = data.age
    if data.preferred_language is not None:
        current_user.preferred_language = data.preferred_language
    if data.theme is not None:
        current_user.theme = data.theme
    if data.profile_photo is not None:
        current_user.profile_photo = data.profile_photo

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/password")
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password does not match")
    
    current_user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.get("/settings", response_model=SettingsOut)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/settings", response_model=SettingsOut)
def update_user_settings(
    data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    
    if data.text_size is not None:
        settings.text_size = data.text_size
    if data.high_contrast is not None:
        settings.high_contrast = data.high_contrast
    if data.reduce_animation is not None:
        settings.reduce_animation = data.reduce_animation
    if data.voice_input_enabled is not None:
        settings.voice_input_enabled = data.voice_input_enabled
    if data.tts_enabled is not None:
        settings.tts_enabled = data.tts_enabled
    if data.activity_reminders is not None:
        settings.activity_reminders = data.activity_reminders
    if data.caregiver_notifications is not None:
        settings.caregiver_notifications = data.caregiver_notifications
    if data.memory_permissions is not None:
        settings.memory_permissions = data.memory_permissions

    db.commit()
    db.refresh(settings)
    return settings
