from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import Memory, FamilyMember

def retrieve_user_memories_and_family(db: Session, user_id: str, query: str) -> Dict[str, Any]:
    """
    Search for personal memories and family member details relevant to the query.
    Extracts explicit matches for names, relationships, routines, places, and events.
    """
    query_lower = query.lower()
    
    # Retrieve all family members for user
    family_members: List[FamilyMember] = db.query(FamilyMember).filter(FamilyMember.user_id == user_id).all()
    # Retrieve all memories for user
    memories: List[Memory] = db.query(Memory).filter(Memory.user_id == user_id).all()
    
    relevant_family = []
    for fm in family_members:
        name_match = fm.name.lower() in query_lower
        rel_match = fm.relationship.lower() in query_lower
        desc_match = any(word in (fm.description or "").lower() for word in query_lower.split() if len(word) > 3)
        memo_match = any(word in (fm.important_memories or "").lower() for word in query_lower.split() if len(word) > 3)
        
        if name_match or rel_match or desc_match or memo_match:
            relevant_family.append({
                "name": fm.name,
                "relationship": fm.relationship,
                "description": fm.description,
                "important_memories": fm.important_memories
            })
            
    relevant_memories = []
    for m in memories:
        title_match = any(word in m.title.lower() for word in query_lower.split() if len(word) > 3)
        person_match = m.person and m.person.lower() in query_lower
        rel_match = m.relationship and m.relationship.lower() in query_lower
        cat_match = m.category.lower() in query_lower
        desc_match = any(word in m.description.lower() for word in query_lower.split() if len(word) > 3)
        
        if title_match or person_match or rel_match or cat_match or desc_match:
            relevant_memories.append({
                "title": m.title,
                "person": m.person,
                "relationship": m.relationship,
                "category": m.category,
                "date": m.date,
                "description": m.description
            })
            
    return {
        "all_family_count": len(family_members),
        "all_memories_count": len(memories),
        "matched_family": relevant_family,
        "matched_memories": relevant_memories,
        "all_family_summary": [
            f"{fm.name} ({fm.relationship}): {fm.description or ''}. Important memories: {fm.important_memories or ''}"
            for fm in family_members
        ],
        "all_memories_summary": [
            f"Title: {m.title} | Category: {m.category} | Person: {m.person or 'N/A'} ({m.relationship or ''}) | Date: {m.date or 'N/A'} | Note: {m.description}"
            for m in memories
        ]
    }
