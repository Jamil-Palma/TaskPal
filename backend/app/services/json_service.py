import json
import os
import re

class JsonService:
    def __init__(self, base_path='data/task'):
        self.base_path = base_path
        if not os.path.exists(self.base_path):
            os.makedirs(self.base_path)

        self.conversation_base_path = 'data/conversations'
        if not os.path.exists(self.conversation_base_path):
            os.makedirs(self.conversation_base_path)

    def _sanitize_filename(self, filename):
        sanitized = filename.replace(" ", "_")
        return sanitized

    def _get_unique_filename(self, base_filename, base_path=None):
        if base_path is None:
            base_path = self.base_path
        filename = self._sanitize_filename(base_filename)
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
        file_path = self._get_unique_filename(base_filename)
        with open(file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
        return file_path

    def read_conversation_json(self, conversation_id):
        file_path = os.path.join(self.conversation_base_path, f"{conversation_id}.json")
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
            "summary": summary
        }

        # Save the result to a file
        file_path = self.write_task_json(title, result)

        return result, file_path
