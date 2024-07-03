from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.audio_service import AudioService
from app.services.text_service import TextService

router = APIRouter()
audio_service = AudioService()
text_service = TextService()


@router.post("/process")
async def process_audio(query: UserQuery):
    try:
        response = audio_service.process_audio(query.filename)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")


@router.post("/audio")
async def process_audio():
    try:
        transcribed_text = audio_service.record_audio(duration=5)
        text_response = text_service.process_query(transcribed_text)
        return {"transcription": text_response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")
