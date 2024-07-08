from pydantic import BaseModel


class UserQuery(BaseModel):
    input_text: str
    conversation_id: str = None
    task: str = None
