from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient

class AudioService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_audio(self, audio_path: str):
        response = self.query_processor.process_audio_query(audio_path)
        return response
    
    def process_upload(self, media_url: str):
        response = self.query_processor.process_media_url(media_url)
        return response