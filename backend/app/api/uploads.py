import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from app.core.config import UPLOAD_DIR
from app.api.deps import get_current_user
from app.models import User

router = APIRouter(prefix="/upload", tags=["Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

@router.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename")
        
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only image files (.jpg, .jpeg, .png, .webp, .gif) are supported")

    # Generate unique user-scoped filename
    file_id = f"user_{current_user.id}_{uuid.uuid4().hex[:12]}{ext}"
    target_path = UPLOAD_DIR / file_id
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit")

    with open(target_path, "wb") as f:
        f.write(contents)

    photo_url = f"/upload/file/{file_id}"
    return {
        "url": photo_url,
        "filename": file_id,
        "size": len(contents)
    }

@router.get("/file/{filename}")
def serve_uploaded_file(filename: str):
    # Sanitize filename to prevent directory traversal
    clean_name = Path(filename).name
    file_path = UPLOAD_DIR / clean_name
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(file_path)
