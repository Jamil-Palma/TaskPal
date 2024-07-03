from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient

class TextService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_query(self, input_text: str):
        response = self.query_processor.process_text_query(input_text)
        return response
