from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.image_service import ImageService

router = APIRouter()
image_service = ImageService()

@router.post("/process")
async def process_image(query: UserQuery):
    try:
        response = image_service.process_image(query.filename)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the image")
