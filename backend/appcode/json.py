from fastapi import APIRouter, HTTPException
import os
import json
import re
from dotenv import load_dotenv, find_dotenv
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser

#1. a function that takes a sentence, let's say, and converts it into valid json, as you know, 
# a prompt returns a string, and there are functions to transform it into json, however, if that 
# string doesn't have specific json format, errors can occur, we want to avoid that and ensure the result 
# is 100% valid json

#2. another function that corrects an invalid json, for example, sometimes it might return with extra 
# characters like ```json{ which makes it invalid json format, the idea is to create a function that corrects 
# these errors when they occur

# router = APIRouter()

# _ = load_dotenv(find_dotenv())

# llm_model = "gemini-1.5-flash"
# chat_llm = ChatGoogleGenerativeAI(temperature=0.0, 
#                       model=llm_model, 
#                       api_key=os.environ.get('OPEN_API_KEY'),
#                       verbose=True)

    
# def fix_invalid_json(): # This is the second function where the user will input an invalid json and it will correct it
#     try:
#         data = request.get_json()
#         user_input = data.get('strInput')

#         print(user_input)

#         output_parser = JsonOutputParser()

#         validate_template_string = """
#         you are a very helpful JSON validator. Given an invalid JSON object, you will correct the JSON format \
#         and return a valid JSON object.

#         Here is an invalid JSON object: {user_input}

#         Please correct the JSON format and return a valid JSON object.
#         """

#         validate_prompt_template = PromptTemplate(template=validate_template_string, input_variables=["user_input"])

#         chain = validate_prompt_template | chat_llm | output_parser

#         validate_result = chain.invoke({"user_input": user_input})
    
#         json_result = json.dumps(validate_result)
#         print(type(json_result))

#         return json_result
#     except Exception as e:
#         return ("Error: ", e)