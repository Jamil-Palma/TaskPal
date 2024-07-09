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
    
    def process_transcript(self, video_path: str):
        response = self.query_processor.process_video_transcript(video_path)
        return response
    
    def process_instructions(self, transcript: str, title: str):
        response = self.query_processor.process_transcript_instructions(transcript, title)
        return response