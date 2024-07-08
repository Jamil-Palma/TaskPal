import uuid
from typing import Dict
from app.services.json_service import JsonService
from app.services.text_service import TextService

class ConversationManager:
    def __init__(self):
        self.json_service = JsonService()
        self.text_service = TextService()
        self.conversations = {}

    def initialize_conversation(self, filename: str) -> str:
        task = self.json_service.read_task_json(filename)
        conversation_id = str(uuid.uuid4())
        self.conversations[conversation_id] = {
            "messages": [],
            "task": task["task"],
            "steps": task["steps"],
            "current_step_index": 0,
            "all_steps_completed": False,
            "summary_task": task["summary_task"],
            "support_tasks": ""
        }
        self.conversations[conversation_id]["messages"].append({"role": "assistant", "content": task["steps"][0]})
        
        self.json_service.write_conversation_json(conversation_id, self.conversations[conversation_id])
        
        return conversation_id

    def process_query(self, conversation_id: str, input_text: str) -> Dict:
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = self.json_service.read_conversation_json(conversation_id)

        state = self.conversations[conversation_id]
        state["messages"].append({"role": "user", "content": input_text})

        response = self.text_service.process_query(input_text)
        
        all_steps_completed = state["current_step_index"] >= len(state["steps"]) - 1
        if not all_steps_completed:
            state["current_step_index"] += 1
            response = state["steps"][state["current_step_index"]]
        else:
            state["all_steps_completed"] = True
            response = "You have completed all the steps."

        state["messages"].append({"role": "assistant", "content": response})

        self.json_service.write_conversation_json(conversation_id, state)

        return {
            "response": response,
            "success": all_steps_completed,
            "conversation_id": conversation_id,
            "current_step_index": state["current_step_index"],
            "all_steps_completed": state["all_steps_completed"],
            "support_tasks": state["support_tasks"],
            "messages": state["messages"]
        }
