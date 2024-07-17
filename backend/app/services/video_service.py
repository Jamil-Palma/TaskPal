import os
from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient
import yt_dlp

class VideoService:
    def __init__(self, base_path='data/video'):
        try:
            self.base_path = base_path
            if not os.path.exists(self.base_path):
                os.makedirs(self.base_path)

            gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
            self.query_processor = QueryProcessor(gemini_client)
        except Exception as e:
            print(f"Error initializing VideoService: {e}")

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
     
    def process_video_download_as_audio(self, video_url: str):
        try:
            ydl_opts = {
                'format': 'bestaudio',
                'outtmpl': f'data/audio/%(title)s.%(ext)s'
            }

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([f'{video_url}'])

                # Get information about the downloaded file
                info_dict = ydl.extract_info(video_url, download=False)
                file_name = ydl.prepare_filename(info_dict)

            print("File name:", file_name)
            return file_name
        except Exception as e:
            return str(e)