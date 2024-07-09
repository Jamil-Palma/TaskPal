from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery, TaskQuery
from app.services.text_service import TextService
from app.core.conversation_manager import ConversationManager
from app.services.json_service import JsonService

router = APIRouter()
text_service = TextService()
conversation_manager = ConversationManager()

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
        json_service = JsonService()
        result, file_path = json_service.process_and_save_scraping_result(
            response['Title'], 
            response['Response'], 
            response['Task Name'], 
            response['Summary']
        )
        return {"response": result}
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



@router.post("/ask")
async def ask_question(user_query: UserQuery):
    try:
        if user_query.conversation_id is None:
            raise HTTPException(status_code=400, detail="Conversation ID must be provided to continue a conversation.")
        
        response = conversation_manager.process_query(user_query.conversation_id, user_query.input_text)
        
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")

@router.post("/start-conversation")
async def start_conversation(task_query: TaskQuery):
    try:
        conversation_id = conversation_manager.initialize_conversation(task_query.task)
        state = conversation_manager.conversations[conversation_id]
        return {
            "response": state["steps"][0],
            "conversation_id": conversation_id,
            "current_step_index": 0,
            "all_steps_completed": False,
            "messages": state["messages"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while starting the conversation.")
