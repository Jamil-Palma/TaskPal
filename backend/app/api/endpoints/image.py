from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.services.image_service import ImageService

router = APIRouter()
image_service = ImageService()

@router.post("/process")
async def process_image(
    file: UploadFile = File(...),
    input_text: Optional[str] = Form("Analyze the picture"),
    conversation_id: Optional[str] = Form(None),
    task: Optional[str] = Form(None)
):
    try:
        # Save the uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Process the image
        response = image_service.process_image(temp_file_path, task, input_text)

        # Clean up the temporary file
        import os
        os.remove(temp_file_path)

        return {"response": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An error occurred while processing the image: {str(e)}"
        )
