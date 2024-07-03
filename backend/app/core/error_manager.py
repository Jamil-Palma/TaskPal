import json

class ErrorManager:
    def handle_json_error(self, error):
        try:
            json_error = json.loads(str(error))
            return json_error
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format"}

    def handle_multimedia_error(self, error):
        return {"error": str(error)}
