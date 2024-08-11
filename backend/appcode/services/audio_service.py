from appcode.core.query_processor import QueryProcessor
from appcode.core.gemini_client import GeminiChainClient
import os
from dotenv import load_dotenv


class AudioService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

    def process_audio(self, audio_path: str):
        response = self.query_processor.process_audio_query(audio_path)
        return response    

    def record_audio(self, duration: int):
        response = self.query_processor.record_audio(duration)
        return response
    
    def process_audio_transcript(self, audio_path: str):
        response = self.query_processor.process_audio_transcript(audio_path)
        return response
    