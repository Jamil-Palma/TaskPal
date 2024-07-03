from pydantic import BaseModel

class UserQuery(BaseModel):
    input_text: str
    conversation_id: str = None
    filename: str = None
