from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient

class VideoService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_video(self, video_path: str):
        # Implement video processing logic here
        response = self.query_processor.process_video_query(video_path)
        return response
