from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.video_service import VideoService
from app.services.json_service import JsonService
from app.services.audio_service import AudioService

router = APIRouter()
video_service = VideoService()
json_service = JsonService()
audio_service = AudioService()

@router.post("/process")
async def process_video(query: UserQuery):
    try:
        response = video_service.process_video(query.filename)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")

# create /transcript endpoint
@router.post("/transcript")
async def process_video_transcript(query: UserQuery):
    try:
        response = video_service.process_transcript(query.input_text)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")
    
@router.post("/video-instructions")
async def process_video_instructions(query: UserQuery):
    try:
        print("- video step 1")
        transcript_res = video_service.process_transcript(query.input_text)
        print("- video step 2 , ", transcript_res)
        instructions_res = video_service.process_instructions(transcript_res["transcript"], transcript_res["title"])
        print("- video step 3")
        result,file_path = json_service.process_save_video_instructions(instructions_res["title"], 
                                                              instructions_res["instructions"], 
                                                              instructions_res["name"], 
                                                              instructions_res["summary"])
        print("------ ", result)
        print(" ------- file_path - ", file_path)
        return {"response": result, "file_path": file_path}
    except Exception as e:
        print("Error: ", e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")
    
@router.post("/more-video-instructions")
async def test(query: UserQuery):
    try:
        # First: download the video as an audio file from a URL
        audio_filename = video_service.process_video_download_as_audio(query.input_text)

        # Second: Get the transcript from the audio file
        audio_transcript = audio_service.process_audio_transcript(audio_filename)

        # Third: Get the instructions from the transcript
        instructions_res = video_service.process_instructions(audio_transcript["transcript"], audio_transcript["title"])

        result,file_path = json_service.process_save_video_instructions(instructions_res["title"], 
                                                              instructions_res["instructions"], 
                                                              instructions_res["name"], 
                                                              instructions_res["summary"])
        return {"response": result, "file_path": file_path}
    except Exception as e:
        return str(e)