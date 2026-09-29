from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, CaregiverPatient, GameResult, Memory
from app.schemas import LinkPatientRequest, PatientCardOut
from app.services.agent_orchestrator import generate_caregiver_insights_summary

router = APIRouter(prefix="/caregiver", tags=["Caregiver"])

@router.get("/patients", response_model=List[PatientCardOut])
def get_caregiver_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Fetch explicit patient links
    links = db.query(CaregiverPatient).filter(CaregiverPatient.caregiver_id == current_user.id).all()
    
    # If no links exist yet, let's find any older adults in the database to offer easy connection
    patient_ids = [l.patient_id for l in links]
    if not patient_ids:
        # Fallback to finding existing older adult accounts
        older_adults = db.query(User).filter(User.role == "OLDER_ADULT").limit(5).all()
        # Automatically create convenient link for caregiver convenience if they are a caregiver
        if current_user.role == "CAREGIVER" and older_adults:
            for oa in older_adults:
                new_link = CaregiverPatient(
                    caregiver_id=current_user.id,
                    patient_id=oa.id,
                    relationship="Family Member"
                )
                db.add(new_link)
            db.commit()
            links = db.query(CaregiverPatient).filter(CaregiverPatient.caregiver_id == current_user.id).all()
            patient_ids = [l.patient_id for l in links]

    patient_cards = []
    for link in links:
        patient = db.query(User).filter(User.id == link.patient_id).first()
        if not patient:
            continue
            
        # Get patient activity stats
        games = db.query(GameResult).filter(GameResult.user_id == patient.id).order_by(GameResult.timestamp.desc()).all()
        mem_count = db.query(Memory).filter(Memory.user_id == patient.id).count()
        
        recent_activity = games[0].game_name if games else "No recent activity"
        last_active = games[0].timestamp if games else patient.created_at
        avg_score = round(sum(g.score for g in games) / len(games), 1) if games else 85.0

        patient_cards.append(
            PatientCardOut(
                id=patient.id,
                name=patient.name,
                email=patient.email,
                age=patient.age,
                profile_photo=patient.profile_photo,
                relationship=link.relationship,
                recent_activity=recent_activity,
                last_active=last_active,
                overall_progress=avg_score,
                memory_count=mem_count,
                games_completed=len(games)
            )
        )
        
    return patient_cards

@router.post("/patients", status_code=status.HTTP_201_CREATED)
def link_patient(
    data: LinkPatientRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(User).filter(User.email == data.patient_email.lower().strip()).first()
    if not patient:
        raise HTTPException(status_code=404, detail="No user found with this email address")
        
    if patient.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot link your own account as a patient")
        
    existing = db.query(CaregiverPatient).filter(
        CaregiverPatient.caregiver_id == current_user.id,
        CaregiverPatient.patient_id == patient.id
    ).first()
    
    if existing:
        return {"message": "Patient is already linked to your caregiver dashboard"}
        
    link = CaregiverPatient(
        caregiver_id=current_user.id,
        patient_id=patient.id,
        relationship=data.relationship.strip()
    )
    db.add(link)
    db.commit()
    return {"message": f"Successfully linked {patient.name} to your care network"}

@router.get("/patients/{patient_id}/insights")
def get_patient_insights(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    insights = generate_caregiver_insights_summary(db=db, patient_id=patient_id)
    return {
        "patientName": patient.name,
        "patientAge": patient.age,
        **insights
    }
