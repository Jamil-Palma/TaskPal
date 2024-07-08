from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery
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
