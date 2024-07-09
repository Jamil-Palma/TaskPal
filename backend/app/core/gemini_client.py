import os
import textwrap
import PIL.Image
import mimetypes
from dotenv import load_dotenv
import google.generativeai as genai
from IPython.display import Markdown
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import json
import pyaudio
import wave
import requests
from bs4 import BeautifulSoup


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
        self.langchain_model = ChatGoogleGenerativeAI(temperature=0.0, google_api_key=api_key, model=model_version)

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

    def generate_text_from_image(self, filename: str, task: str, input_text: str):
        """
        Generate text based on an input image, considering the task context.
        """
        prompt = f"""You are an AI assistant specializing in image analysis and task-specific problem-solving.
        The current task context is: {task}
        The user's query is: {input_text}

        Analyze the given image and respond with a JSON object containing the following:
        1. "relevance": A boolean indicating if the image is relevant to the task context.
        2. "analysis": If relevant, provide a detailed analysis of the image content related to the task. If not relevant, leave this field empty.
        4. "solution": If relevant and the image shows a problem, provide a solution or next steps. If not relevant or no problem is evident, leave this field empty.

        Ensure your response is in valid JSON format.
        """
        img = PIL.Image.open(filename)
        response = self.model.generate_content([prompt, img])
        token = response.usage_metadata.candidates_token_count
        total_tokens = response.usage_metadata.total_token_count
        print(f"Response token: {token}")
        print(f"Total tokens: {total_tokens}")

        return response.text

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

    def record_audio(self, duration=5, sample_rate=16000, channels=1, chunk=1024):
        # Initialize PyAudio
        p = pyaudio.PyAudio()

        # Open stream
        stream = p.open(format=pyaudio.paInt16,
                        channels=channels,
                        rate=sample_rate,
                        input=True,
                        frames_per_buffer=chunk)

        print("Recording...")

        frames = []
        for _ in range(0, int(sample_rate / chunk * duration)):
            data = stream.read(chunk)
            frames.append(data)

        print("Recording finished.")

        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        p.terminate()

        # Save the recorded data as a WAV file
        temp_filename = "temp_audio.wav"
        wf = wave.open(temp_filename, 'wb')
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))
        wf.close()

        # Transcribe the audio using GeminiChainClient
        transcribed_text = self.speech_to_text(temp_filename)

        # Clean up the temporary file
        os.remove(temp_filename)

        return transcribed_text

    def process_scraping(self, url: str):
        """
        Process scraping based on the input URL.
        """
        page = requests.get(url.input_text)
        soup = BeautifulSoup(page.content, 'html.parser')
        title = soup.title.text
        title = title.replace("-", "").replace(" ", "_")
        article_text = " ".join([p.text for p in soup.find_all('p')])
        prompt = """You are an expert IT instructor. Now I will give you a complete article,
        Read and analyze the article, Then I want you to create a step-by-step guide on \
        how to complete the task described in the article.
        Format your response as a JSON object with a 'steps' key containing an array of strings.
        Each string should be a complete step, including the 'Step X:' prefix.
        Do not include '''json in your response.
        example output:
        {
            "steps": [
                "Step 1: Do this",
                "Step 2: Do that",
                "Step 3: Finish"
            ]
        }

        ## Article Content:
        """ + article_text
        prompt_summary = """You are an AI language model. Please summarize the following text \
        in no more than one paragraph.

        ## Article Content:
        """ + article_text
        summary = self.model.generate_content(prompt_summary)

        task_prompt = """You are an AI language model. I'll provide you a summary of a text. \
        Your task is to generate one short name for the task based on the summary.""" + summary.text

        response = self.model.generate_content(prompt)
        task_name = self.model.generate_content(task_prompt)
        return {"Title": title, "Response": response.text, "Task Name": task_name.text, "Summary": summary.text}

    def upload_media(self, media_url: str):
        """
        Upload media from URL.
        """
        image_ext = ['.png', '.jpeg', '.webp', '.heic', '.heif']
        audio_ext = ['.wav', '.mp3', '.aiff', '.aac', '.ogg', '.flac']
        video_ext = ['.mp4', '.mpeg', '.mov', '.avi',
                     '.FLV', '.mpg', '.webm', '.wmv', '.3gpp']
        text_ext = ['.txt', '.html', '.css', '.js',
                    '.ts', '.csv', '.py', '.json', '.xml', '.rtf']
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
        Get transcript from YouTube url.
        """
        page = requests.get(video_path)
        soup = BeautifulSoup(page.text, 'html.parser')
        title = soup.find("meta", itemprop="name")['content']
        title = title.replace("-", "").replace(" ", "_")
        video_id = video_path.split("v=")[-1]
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = ' '.join([d['text']
                             for d in transcript_list]).replace('\n', ' ')
        return {"transcript": transcript, "title": title}
    
    def video_transcript_instructions(self, transcript: str, title: str):
        """
        Get instructions from a YouTube video transcript.
        """
        instruction_prompt = """You are an expert IT instructor. Create a step-by-step guide on how to
        complete the task from the video transcript. \
        Format your response as a JSON object with a 'steps' key containing an array of strings.
        Each string should be a complete step, including the 'Step X:' prefix.
        Do not include '''json in your response.
        example output:
        {
            "steps": [
                "Step 1: Do this",
                "Step 2: Do that",
                "Step 3: Finish"
            ]
        }

        ## Transcript:
        """ + transcript

        summary_prompt = """ Generate a conscise summary of the video transcript. \
        Transcript: """ + transcript

        name_prompt = """ Generate a concise name for the task from the title of the video. 
        Title: """ + title

        instructions = self.model.generate_content(instruction_prompt)
        instructions = self.fix_json(instructions.text)
        summary = self.model.generate_content(summary_prompt)
        name = self.model.generate_content(name_prompt)

        return {"title": title, "instructions": instructions, "summary": summary.text, "name": name.text}
    
    def fix_json(self, json_input: str):
        """
        Fix invalid json.
        """
        output_parser = JsonOutputParser()
        validate_template_string = """
        you are a very helpful JSON validator. Given an invalid JSON object, you will correct the JSON format \
        and return a valid JSON object.

        Here is an invalid JSON object: {json_input}

        Please correct the JSON format and return a valid JSON object.
        """

        validate_prompt_template = PromptTemplate(template=validate_template_string, input_variables=["json_input"])
        chain = validate_prompt_template | self.langchain_model | output_parser
        validate_result = chain.invoke({"json_input": json_input})

        return validate_result

