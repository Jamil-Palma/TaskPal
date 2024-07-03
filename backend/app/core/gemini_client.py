import os
import textwrap
import PIL.Image
import mimetypes
from dotenv import load_dotenv
import google.generativeai as genai
from IPython.display import Markdown
from youtube_transcript_api import YouTubeTranscriptApi


class GeminiChainClient:
    def __init__(self, model_version: str):
        """
        Initialize the client with the specific model version.
        """
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "API_KEY is missing from the environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_version)

    @staticmethod
    def to_markdown(text):
        """
        Convert text to Markdown format.
        """
        text = text.replace('•', '  *')
        return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

    def generate_text(self, input_text: str):
        """
        Generate text based on input text.
        """
        response = self.model.generate_content(input_text)
        return response.text

    def generate_text_from_image(self, image_path: str):
        """
        Generate text based on an input image.
        """

        prompt = """You are a expert photographer. Give the image a rating from 1 to 10 based on the skill """
        img = PIL.Image.open(image_path)
        response = self.model.generate_content([prompt, img])
        token = response.usage_metadata.candidates_token_count
        total_tokens = response.usage_metadata.total_token_count
        print(f"Response token: {token}")
        print(f"Total tokens: {total_tokens}")

        return (response.text)

    def speech_to_text(self, audio_path: str):
        """
        Convert speech to text.
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError("Audio file not found!")

        with open(audio_path, 'rb') as audio_file:
            audio_data = audio_file.read()

        audio = {
            "inline_data": {
                "data": audio_data,
                "mime_type": mimetypes.guess_type(audio_path)[0]
            }
        }
        prompt = "Extract text from this audio."
        response = self.model.generate_content([audio, prompt])
        return response.text
    
    def upload_media(self, media_url: str):
        """
        Upload media from URL.
        """
        image_ext = ['.png', '.jpeg', '.webp', '.heic', '.heif']
        audio_ext = ['.wav', '.mp3', '.aiff', '.aac', '.ogg', '.flac']
        video_ext = ['.mp4', '.mpeg', '.mov', '.avi', '.FLV', '.mpg', '.webm', '.wmv', '.3gpp']
        text_ext = ['.txt', '.html', '.css', '.js', '.ts', '.csv', '.py', '.json', '.xml', '.rtf']
        media_file_name = media_url.split("/")[-1].replace("%20", "_")

        if any(ext in media_file_name for ext in image_ext):
            os.system(f"wget -O {media_file_name} {media_url} && mv {media_file_name} ./data/image/{media_file_name}")
            return "./data/image/" + media_file_name
        if any(ext in media_file_name for ext in audio_ext):
            os.system(f"wget -O {media_file_name} {media_url} && mv {media_file_name} ./data/audio/{media_file_name}")
            return "./data/audio/" + media_file_name
        if any(ext in media_file_name for ext in video_ext):
            os.system(f"wget -O {media_file_name} {media_url} && mv {media_file_name} ./data/video/{media_file_name}")
            return "./data/video/" + media_file_name
        if any(ext in media_file_name for ext in text_ext):
            os.system(f"wget -O {media_file_name} {media_url} && mv {media_file_name} ./data/text/{media_file_name}")
            return "./data/text/" + media_file_name
        
    def video_transcript(self, video_path: str):
        """
        Convert video to text.
        """
        print("video_path: ", video_path)
        video_id = video_path.split("v=")[-1]
        print("video_id: ", video_id)

        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = ''.join([d['text'] for d in transcript_list]).replace('\n', ' ')
        print("transcript: ", transcript)

        return transcript

        # if not os.path.exists(video_path):
        #     raise FileNotFoundError("Video file not found!")

        # with open(video_path, 'rb') as video_file:
        #     video_data = video_file.read()

        # print(mimetypes.guess_type(video_path)[0])

        # video = {
        #     "inline_data": {
        #         "data": video_data,
        #         "mime_type": mimetypes.guess_type(video_path)[0]
        #     }
        # }
        # prompt = "Extract text from this video."
        # response = self.model.generate_content([video, prompt])
        # return response.text