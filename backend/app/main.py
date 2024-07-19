from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import text, audio, image, video

app = FastAPI()

origin =[
    "https://6298-181-188-179-21.ngrok-free.app",
    "http://localhost:3000",
    "https://9b00-181-115-171-218.ngrok-free.app",
    "https://3c29-181-115-171-218.ngrok-free.app",
    "https://e2ca-181-115-171-218.ngrok-free.app",
    "https://671a-181-115-171-218.ngrok-free.app",
    "https://339b-181-115-171-218.ngrok-free.app",
    "https://01b2-181-115-171-218.ngrok-free.app"
]

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin, 
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
