from pydantic import BaseModel
from gemini_client import GeminiChainClient
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserQuery(BaseModel):
    input_text: str
    conversation_id: str = None
    filename: str = None


# Example usage
client = GeminiChainClient(model_version='gemini-1.5-flash')
# transcribed_text = client.record_audio(duration=5)
# print("Transcribed text:", transcribed_text)
# text_from_image = client.generate_text_from_image('./image/image.jpg')
# print(text_from_image)
# Convert speech to text
# audio_path = "./audio/audio.mp3"
# text_response = client.speech_to_text(audio_path)
# print(text_response)


@app.post("/question")
async def process_question(query: UserQuery):
    try:
        question = query.input_text
        text_response = client.generate_text(question)
        return {"response": text_response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the request")


@app.post("/audio")
async def process_audio():
    try:
        transcribed_text = client.record_audio(duration=5)
        text_response = client.generate_text(transcribed_text)
        return {"transcription": text_response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing the audio")
