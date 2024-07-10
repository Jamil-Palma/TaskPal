from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import text, audio, image, video

app = FastAPI()

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://6312-181-115-171-218.ngrok-free.app", 
        "https://a789-181-115-171-218.ngrok-free.app",
        "https://a8fa-181-115-171-218.ngrok-free.app"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text.router, prefix="/text", tags=["text"])
app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(image.router, prefix="/image", tags=["image"])
app.include_router(video.router, prefix="/video", tags=["video"])

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application"}
