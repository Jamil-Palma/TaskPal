class QueryProcessor:
    def __init__(self, gemini_client):
        self.gemini_client = gemini_client

    def process_text_query(self, text):
        response = self.gemini_client.generate_text(text)
        return response

    def process_image_query(self, filename: str, task: str, input_text: str):
        response = self.gemini_client.generate_text_from_image(
            filename, task, input_text)
        return response

    def process_audio_query(self, audio_path):
        response = self.gemini_client.speech_to_text(audio_path)
        return response

    def record_audio(self, duration):
        response = self.gemini_client.record_audio(duration)
        return response

    def process_scraping(self, url):
        response = self.gemini_client.process_scraping(url)
        return response

    def process_video_transcript(self, video_url):
        response = self.gemini_client.video_transcript(video_url)
        return response
    
    def process_transcript_instructions(self, transcript, title):
        response = self.gemini_client.video_transcript_instructions(transcript, title)
        return response
    
    def process_fix_json(self, json):
        response = self.gemini_client.fix_json(json)
        return response
    
    def process_audio_transcript(self, audio_path):
        response = self.gemini_client.audio_to_text(audio_path)
        return response