from appcode.core.query_processor import QueryProcessor
from appcode.core.gemini_client import GeminiChainClient


class ImageService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_image(self, filename: str, task: str, input_text: str):
        response = self.query_processor.process_image_query(
            filename, task, input_text)
        return response
