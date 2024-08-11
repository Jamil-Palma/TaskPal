import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from appcode.api.endpoints import text, audio, image, video
from appcode.services.json_service import JsonService

app = FastAPI()

origins = [
    "https://taskpal-chat.web.app",
    "http://localhost:3000",
    # ... otras URLs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text.router, prefix="/text", tags=["text"])
app.include_router(audio.router, prefix="/audio", tags=["audio"])
app.include_router(image.router, prefix="/image", tags=["image"])
app.include_router(video.router, prefix="/video", tags=["video"])

@app.get("/")
async def root(health: dict = Depends(text.health_check)):
    return {
        "message": "Welcome to the FastAPI application version 2",
        "health": health
    }

# Nuevo endpoint para pruebas básicas
@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint is working correctly"}

# Nuevo endpoint para replicar /text/conversations
@app.post("/test/conversations")
async def test_conversations():
    json_service = JsonService()
    try:
        conversations = json_service.get_all_conversations()
        return {"conversations": conversations}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving the conversations"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
