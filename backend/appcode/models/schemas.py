from pydantic import BaseModel
from typing import List, Optional


class UserQuery(BaseModel):
    input_text: str
    conversation_id: Optional[str] = None
    filename: Optional[str] = None

class TaskQuery(BaseModel):
    task: str


class RenameRequest(BaseModel):
    new_name: str

