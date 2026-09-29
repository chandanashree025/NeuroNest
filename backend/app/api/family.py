from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, FamilyMember
from app.schemas import FamilyMemberCreate, FamilyMemberUpdate, FamilyMemberOut

router = APIRouter(prefix="/family-members", tags=["Family Members"])

@router.get("", response_model=List[FamilyMemberOut])
def list_family_members(
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    return db.query(FamilyMember).filter(FamilyMember.user_id == target_user_id).order_by(FamilyMember.created_at.desc()).all()

@router.post("", response_model=FamilyMemberOut, status_code=status.HTTP_201_CREATED)
def add_family_member(
    data: FamilyMemberCreate,
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    member = FamilyMember(
        user_id=target_user_id,
        name=data.name.strip(),
        relationship=data.relationship.strip(),
        photo=data.photo,
        description=data.description.strip() if data.description else None,
        important_memories=data.important_memories.strip() if data.important_memories else None
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.put("/{member_id}", response_model=FamilyMemberOut)
def update_family_member(
    member_id: str,
    data: FamilyMemberUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found")
        
    if member.user_id != current_user.id and current_user.role != "CAREGIVER":
        raise HTTPException(status_code=403, detail="Not authorized to edit this family member")

    if data.name is not None:
        member.name = data.name.strip()
    if data.relationship is not None:
        member.relationship = data.relationship.strip()
    if data.photo is not None:
        member.photo = data.photo
    if data.description is not None:
        member.description = data.description.strip() if data.description else None
    if data.important_memories is not None:
        member.important_memories = data.important_memories.strip() if data.important_memories else None

    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}", status_code=status.HTTP_200_OK)
def delete_family_member(
    member_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found")

    if member.user_id != current_user.id and current_user.role != "CAREGIVER":
        raise HTTPException(status_code=403, detail="Not authorized to delete this family member")

    db.delete(member)
    db.commit()
    return {"message": "Family member deleted successfully"}
