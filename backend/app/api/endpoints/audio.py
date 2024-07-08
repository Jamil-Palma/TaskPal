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
        print("TEXTO DEL AUDIO: ",transcribed_text)
        text_response = text_service.process_query(transcribed_text)
        return {"transcription": text_response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")

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