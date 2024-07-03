import uuid
from typing import Dict

class ConversationManager:
    def __init__(self, evaluator):
        self.evaluator = evaluator
        self.conversations = {}

    def initialize_conversation(self, task: Dict) -> str:
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
        return conversation_id

    def process_query(self, conversation_id: str, input_text: str) -> Dict:
        if conversation_id not in self.conversations:
            raise ValueError("Task not initialized")

        state = self.conversations[conversation_id]
        state["messages"].append({"role": "user", "content": input_text})

        try:
            response = self.evaluator.evaluate(state)
            state.update(response)
            return {
                "response": response["messages"][-1]["content"],
                "success": response.get("all_steps_completed", False),
                "conversation_id": conversation_id,
                "current_step_index": response["current_step_index"],
                "all_steps_completed": response["all_steps_completed"],
                "support_tasks": response["support_tasks"]
            }
        except Exception as e:
            return {
                "response": "An error occurred while processing your request.",
                "success": False,
                "conversation_id": conversation_id,
                "current_step_index": state["current_step_index"],
                "all_steps_completed": state["all_steps_completed"],
                "support_tasks": state["support_tasks"]
            }
