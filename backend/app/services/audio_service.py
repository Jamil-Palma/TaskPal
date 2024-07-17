from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient
import cloudconvert
import os
from dotenv import load_dotenv


class AudioService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)

        load_dotenv()
        api_key = os.getenv("CLOUDCONVERT_API_KEY")

        if not api_key:
            raise ValueError(
                "API_KEY is missing from the environment variables.")

        cloudconvert.configure(api_key=api_key)

    def process_audio(self, audio_path: str):
        response = self.query_processor.process_audio_query(audio_path)
        return response    

    def record_audio(self, duration: int):
        response = self.query_processor.record_audio(duration)
        return response

    def process_upload(self, media_url: str):
        response = self.query_processor.process_media_url(media_url)
        return response
    
    def process_audio_transcript(self, audio_path: str):
        response = self.query_processor.process_audio_transcript(audio_path)
        return response
    
    def audio_conversion(self, audio_path: str):
        try:
            if '.m4a' in audio_path:
                print("input file path: ", audio_path)
                process = cloudconvert.Api().convert({
                    'inputformat': 'm4a',
                    'outputformat': 'mp3',
                    'input': 'upload',
                    'file': open(audio_path, 'rb')
                })
                process.wait()  # Wait until conversion is done
                # Download the converted file
                process.download(audio_path.replace('.m4a', '.mp3'))

            print("output file path: ", audio_path)
            return audio_path
        except Exception as e:
            return str(e)