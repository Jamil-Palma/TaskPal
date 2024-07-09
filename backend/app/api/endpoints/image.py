from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import UserQuery
from app.services.image_service import ImageService
from typing import Annotated

router = APIRouter()
image_service = ImageService()

@router.post("/process")
async def process_image(
    file: Annotated[UploadFile, File()],
    input_text: Annotated[str, Form()],
    conversation_id: Annotated[str | None, Form()] = None,
    task: Annotated[str | None, Form()] = None
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
