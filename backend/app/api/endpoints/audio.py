from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from app.models.schemas import UserQuery
from app.services.audio_service import AudioService
from app.services.text_service import TextService
from pathlib import Path
import os

router = APIRouter()
audio_service = AudioService()
text_service = TextService()
# Define the path to save uploaded audio files
UPLOAD_DIRECTORY = Path(__file__).resolve().parent.parent.parent.parent / "data" / "audio"
UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)

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
        # text_response = text_service.process_query(transcribed_text)
        return {"transcription": transcribed_text}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")

def get_unique_file_path(directory: Path, filename: str) -> Path:
    base, ext = filename.rsplit('.', 1)
    counter = 0
    unique_path = directory / filename
    while unique_path.exists():
        counter += 1
        new_filename = f"{base}{counter:02d}.{ext}"
        unique_path = directory / new_filename
    return unique_path

@router.post("/upload_process")
async def upload_audio(file: UploadFile = File(...)):
    try:
        temp_file_path = UPLOAD_DIRECTORY / file.filename
        with open(temp_file_path, "wb") as f:
            f.write(await file.read())

        # Transcribe the audio using a dummy transcription function
        transcribed_text = audio_service.process_audio(str(temp_file_path))

        # Clean up the temporary file
        os.remove(temp_file_path)

        return {"transcription": transcribed_text}
        # return JSONResponse(content={"message": "File uploaded and transcribed successfully", "transcription": transcribed_text})

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")