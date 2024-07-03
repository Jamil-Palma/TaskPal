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

@router.post("/transcribe")
async def transcribe_audio_url(query: UserQuery):
    try:
        audio_url = query.input_text
        print(audio_url)
        file_path = audio_service.process_upload(audio_url)
        print(file_path)
        # transcription = audio_service.process_audio(file_path)
        # print(transcription)
        # return {"response": transcription}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request")