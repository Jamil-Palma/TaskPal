class QueryProcessor:
    def __init__(self, gemini_client):
        self.gemini_client = gemini_client

    def process_text_query(self, text):
        response = self.gemini_client.generate_text(text)
        return response

    def process_image_query(self, image_path):
        response = self.gemini_client.generate_text_from_image(image_path)
        return response

    def process_audio_query(self, audio_path):
        response = self.gemini_client.speech_to_text(audio_path)
        return response
    
    def process_media_url(self, media_url):
        response = self.gemini_client.upload_media(media_url)
        return response