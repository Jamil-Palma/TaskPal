import json
import os
import re
from appcode.core.query_processor import QueryProcessor
from appcode.core.gemini_client import GeminiChainClient

class JsonService:
    def __init__(self, base_path='data/task'):
        try:
            self.base_path = base_path
            if not os.path.exists(self.base_path):
                os.makedirs(self.base_path)

            self.conversation_base_path = 'data/conversations'
            if not os.path.exists(self.conversation_base_path):
                os.makedirs(self.conversation_base_path)

            gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
            self.query_processor = QueryProcessor(gemini_client)
        except Exception as e:
            print(f"Error initializing JsonService: {e}")

    def _sanitize_filename(self, filename):
        try:            
            sanitized = filename.replace(" ", "_")
            sanitized = re.sub(r'[^a-zA-Z0-9_]', '', sanitized)
            return sanitized
        except Exception as e:
            print(f"Error sanitizing filename: {e}")
            return None

    def _get_unique_filename(self, base_filename, base_path=None):
        if base_path is None:
            base_path = self.base_path
        filename = self._sanitize_filename(base_filename)
        if filename is None:
            return None
        file_path = os.path.join(base_path, f"{filename}.json")
        counter = 1
        while os.path.exists(file_path):
            file_path = os.path.join(base_path, f"{filename}_{counter}.json")
            counter += 1
        return file_path
    def read_task_json(self, filename):
        file_path = os.path.join(self.base_path, filename)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"{filename} not found in {self.base_path}")

        with open(file_path, 'r') as json_file:
            return json.load(json_file)

    def write_task_json(self, base_filename, data):
        try:
            file_path = self._get_unique_filename(base_filename)
            with open(file_path, 'w') as json_file:
                json.dump(data, json_file, indent=4)
            return file_path
        except Exception as e:
            print(f"Error writing task JSON: {e}")

    def read_conversation_json(self, conversation_id):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
        print("my file_path is ", file_path)
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Conversation {conversation_id} not found in {self.conversation_base_path}")

        with open(file_path, 'r') as json_file:
            return json.load(json_file)

    def write_conversation_json(self, conversation_id, data):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
        with open(file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        return file_path

    def process_and_save_scraping_result(self, title, response_text, task_name, summary):
        response_text = response_text.strip('`').strip()
        if response_text.startswith('json'):
            response_text = response_text[4:].strip()

        try:
            # Parse the response as JSON
            response_json = json.loads(response_text)
            steps = response_json.get('steps', [])
        except json.JSONDecodeError:
            # If JSON parsing fails, fallback to regex extraction
            steps = re.findall(r"(Step \d+:.*?)(?=Step \d+:|$)",
                               response_text, re.DOTALL)
            steps = [step.strip() for step in steps]

        # Create the final JSON structure
        result = {
            "task": task_name,
            "steps": steps,
            "summary_task": summary
        }

        # Save the result to a file
        file_path = self.write_task_json(title, result)

        return result, file_path

    def process_fix_json(self, json: str):
        response = self.query_processor.process_fix_json(json)
        return response
    
    def process_save_video_instructions(self, title, instructions, task_name, summary):
        steps = instructions.get('steps', [])
        result = {
            "task": task_name.replace("\n", " "),
            "steps": steps,
            "summary_task": summary
        }

        # Save the result to a file
        file_path = self.write_task_json(title, result)

        return result, file_path
    def get_all_tasks(self):
        tasks = []
        for filename in os.listdir(self.base_path):
            if filename.endswith('.json'):
                file_path = os.path.join(self.base_path, filename)
                with open(file_path, 'r') as json_file:
                    content = json.load(json_file)
                    task_info = {
                        'title': filename.replace('.json', '').replace('_', ' '),
                        'content': content,
                        'file_name': filename
                    }
                    tasks.append(task_info)
        return tasks
    
    def get_all_conversations(self):
        conversations = []
        for filename in os.listdir(self.conversation_base_path):
            if filename.endswith('.json'):
                file_path = os.path.join(self.conversation_base_path, filename)
                with open(file_path, 'r') as json_file:
                    content = json.load(json_file)
                    conversation_info = {
                        'filename': filename,
                        'conversation_id': filename.replace('.json', ''),
                        'all_steps_completed': content.get('all_steps_completed', False),
                        'summary_task': content.get('summary_task', ''),
                        'registration_date': content.get('registration_date', ''),
                        # Include pinned status
                        'pinned': content.get('pinned', False)
                    }
                    conversations.append(conversation_info)
        return conversations
    

    def delete_conversation(self, conversation_id):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Conversation {conversation_id} not found in {self.conversation_base_path}")

        os.remove(file_path)

    def toggle_pin_conversation(self, conversation_id):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Conversation {conversation_id} not found in {self.conversation_base_path}")

        # Load the conversation data
        with open(file_path, 'r') as file:
            conversation_data = json.load(file)

        # Toggle the pinned status
        conversation_data['pinned'] = not conversation_data.get('pinned', False)

        # Save the updated data
        with open(file_path, 'w') as file:
            json.dump(conversation_data, file)

    def rename_conversation(self, conversation_id, new_name):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Conversation {conversation_id} not found in {self.conversation_base_path}")

        # Load the conversation data
        with open(file_path, 'r') as file:
            conversation_data = json.load(file)

        # Update the summary_task or relevant field
        conversation_data['summary_task'] = new_name

        # Save the updated data
        with open(file_path, 'w') as file:
            json.dump(conversation_data, file)
