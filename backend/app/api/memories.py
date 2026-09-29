from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.deps import get_current_user
from app.models import User, Memory
from app.schemas import MemoryCreate, MemoryUpdate, MemoryOut

router = APIRouter(prefix="/memories", tags=["Memories"])

@router.get("", response_model=List[MemoryOut])
def list_memories(
    category: Optional[str] = None,
    search: Optional[str] = None,
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    query = db.query(Memory).filter(Memory.user_id == target_user_id)
    
    if category and category.lower() != "all":
        query = query.filter(Memory.category.ilike(category))
    if search:
        s = f"%{search}%"
        query = query.filter((Memory.title.ilike(s)) | (Memory.description.ilike(s)) | (Memory.person.ilike(s)))
        
    return query.order_by(Memory.created_at.desc()).all()

@router.post("", response_model=MemoryOut, status_code=status.HTTP_201_CREATED)
def create_memory(
    data: MemoryCreate,
    patient_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_user_id = patient_id if (patient_id and current_user.role == "CAREGIVER") else current_user.id
    new_mem = Memory(
        user_id=target_user_id,
        title=data.title.strip(),
        person=data.person.strip() if data.person else None,
        relationship=data.relationship.strip() if data.relationship else None,
        date=data.date.strip() if data.date else None,
        description=data.description.strip(),
        category=data.category or "Family",
        photo=data.photo
    )
    db.add(new_mem)
    db.commit()
    db.refresh(new_mem)
    return new_mem

@router.put("/{memory_id}", response_model=MemoryOut)
def update_memory(
    memory_id: str,
    data: MemoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mem = db.query(Memory).filter(Memory.id == memory_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")
        
    # Check access permission
    if mem.user_id != current_user.id and current_user.role != "CAREGIVER":
        raise HTTPException(status_code=403, detail="Not authorized to edit this memory")
        
    if data.title is not None:
        mem.title = data.title.strip()
    if data.person is not None:
        mem.person = data.person.strip() if data.person else None
    if data.relationship is not None:
        mem.relationship = data.relationship.strip() if data.relationship else None
    if data.date is not None:
        mem.date = data.date.strip() if data.date else None
    if data.description is not None:
        mem.description = data.description.strip()
    if data.category is not None:
        mem.category = data.category
    if data.photo is not None:
        mem.photo = data.photo

    db.commit()
    db.refresh(mem)
    return mem

@router.delete("/{memory_id}", status_code=status.HTTP_200_OK)
def delete_memory(
    memory_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mem = db.query(Memory).filter(Memory.id == memory_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Memory not found")
        
    if mem.user_id != current_user.id and current_user.role != "CAREGIVER":
        raise HTTPException(status_code=403, detail="Not authorized to delete this memory")

    db.delete(mem)
    db.commit()
    return {"message": "Memory deleted successfully"}
