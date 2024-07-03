from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient

class ImageService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_image(self, image_path: str):
        response = self.query_processor.process_image_query(image_path)
        return response
