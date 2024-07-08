from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery, TaskQuery
from app.services.text_service import TextService

router = APIRouter()
text_service = TextService()

@router.post("/question")
async def process_question(query: UserQuery):
    try:
        response = text_service.process_query(query.input_text)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request")

@router.post("/scraping")
async def process_scraping(url: UserQuery):
    try:
        response = text_service.process_scraping(url)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request")

@router.post("/generate-steps")
async def generate_steps(task_query: TaskQuery):
    try:
        print("start")
        response = text_service.generate_task_steps(task_query.task)
        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An error occurred while generating the steps for the task")
