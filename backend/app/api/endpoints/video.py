from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
from app.services.video_service import VideoService
from app.core.gemini_client import GeminiChainClient
from app.services.json_service import JsonService

gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
json_service = JsonService()
router = APIRouter()
video_service = VideoService()

@router.post("/process")
async def process_video(query: UserQuery):
    try:
        response = video_service.process_video(query.filename)
        data = gemini_client.process_video_transcription(response)
        print("data: " , data)


        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")



# create /transcript endpoint
@router.post("/transcript")
async def process_video_transcript(query: UserQuery):
    try:
        response = video_service.process_transcript(query.input_text)

        data = gemini_client.process_video_transcription(response)
        print("data: " , data)
        json_response = json_service.process_fix_json(response)  # json.loads(response)
        print(" --- json ", json_response)
        file_path = json_service.write_task_json('task_steps.json', json_response)
        return {"json_response":json_response, "file_path":file_path}
        return {"response": response}
    except Exception as e:
        print("error is: ", e)
        raise HTTPException(status_code=500, detail="An error occurred while processing the video")
    