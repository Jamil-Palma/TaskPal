from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.video_service import VideoService
from app.services.json_service import JsonService

router = APIRouter()
video_service = VideoService()
json_service = JsonService()

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
        print("- video step 2")
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
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")