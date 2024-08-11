import uuid
from typing import Dict, List
from datetime import datetime
from appcode.services.json_service import JsonService
from appcode.services.text_service import TextService

class ConversationManager:
    def __init__(self, conversation_base_path: str):
        self.json_service = JsonService()
        self.text_service = TextService()
        self.conversations = {}
        self.conversation_base_path = conversation_base_path

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
            "support_tasks": "",
            "file_path": filename,
            "registration_date": datetime.now().isoformat()
        }
        self.conversations[conversation_id]["messages"].append({
            "role": "assistant",
            "content": task["steps"][0],
            "is_original_instruction": True
        })
        
        self.json_service.write_conversation_json(conversation_id, self.conversations[conversation_id])
        print("conversation_id", conversation_id)
        return conversation_id


    def process_query(self, conversation_id: str, input_text: str, summary_task: str) -> Dict:
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = self.json_service.read_conversation_json(conversation_id)

        state = self.conversations[conversation_id]
        state["messages"].append({
            "role": "user",
            "content": input_text,
            "is_original_instruction": False
        })

        current_step_index = state["current_step_index"]
        system_question = state["messages"][-2]["content"]

        is_correct = self.text_service.confirm_response(input_text, system_question, summary_task)

        if is_correct:
            all_steps_completed = current_step_index >= len(state["steps"]) - 1
            if not all_steps_completed:
                state["current_step_index"] += 1
                response = state["steps"][state["current_step_index"]]
                is_original_instruction = True
            else:
                state["all_steps_completed"] = True
                response = "You have completed all the steps."
                is_original_instruction = True
        else:
            print("help hint 1")
            relevant_history = []
            for message in reversed(state["messages"]):
                relevant_history.insert(0, message)
                if message["is_original_instruction"]:
                    break
            print("help hint 2")

            additional_info = {
                "summary_task": state["summary_task"],
                "current_step": state["steps"][current_step_index],
                "relevant_history": relevant_history
            }
            print("help hint 3")

            response = self.text_service.provide_hint(input_text, system_question, additional_info)
            print("help hint 4")
            is_original_instruction = False

        state["messages"].append({
            "role": "assistant",
            "content": response,
            "is_original_instruction": is_original_instruction
        })

        self.json_service.write_conversation_json(conversation_id, state)

        return {
            "response": response,
            "success": is_correct,
            "conversation_id": conversation_id,
            "current_step_index": state["current_step_index"],
            "all_steps_completed": state["all_steps_completed"],
            "support_tasks": state["support_tasks"],
            "messages": state["messages"]
        }

    def get_all_conversations(self) -> List[Dict]:
        return self.json_service.get_all_conversations()
    
    def read_conversation_json(self, conversation_id: str) -> Dict:
        return self.json_service.read_conversation_json(conversation_id)
