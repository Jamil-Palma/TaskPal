from fastapi import APIRouter, HTTPException
from app.models.schemas import UserQuery, TaskQuery
from app.services.text_service import TextService
from app.services.json_service import JsonService
from app.core.conversation_manager import ConversationManager

router = APIRouter()
text_service = TextService()
json_service = JsonService()
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

@router.post("/fix_json")
async def fix_json(query: UserQuery):
    try:
        response2 = json_service.process_fix_json(query.input_text)

        invalid_json_test = """
        {
            "task": "Create Hello World with Axios in React"
            "steps": [
            "Set up React project using 'npx create-react-app hello-world-app' and navigate to the project directory",
            "Install Axios with 'npm install axios'"
            "Create a simple component to fetch data: create 'HelloWorld.js', import Axios, define component, use 'useEffect' to fetch data, render data in component"
            ],
            "summary_task": "Create a React component that fetches and displays data using Axios."
        }
        """

        response = json_service.process_fix_json(invalid_json_test)

        return response
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request")
    

@router.post("/tasks")
async def test_json():
    try:
        response = json_service.get_all_tasks()
        # print(response)
        return response
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request TEST")