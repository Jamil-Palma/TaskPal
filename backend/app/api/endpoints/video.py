from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.video_service import VideoService

router = APIRouter()
video_service = VideoService()

@router.post("/process")
async def process_video(query: UserQuery):
    try:
        response = video_service.process_video(query.filename)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")
