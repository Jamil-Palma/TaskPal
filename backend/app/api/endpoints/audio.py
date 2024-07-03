from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.audio_service import AudioService

router = APIRouter()
audio_service = AudioService()

@router.post("/process")
async def process_audio(query: UserQuery):
    try:
        response = audio_service.process_audio(query.filename)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the audio")
