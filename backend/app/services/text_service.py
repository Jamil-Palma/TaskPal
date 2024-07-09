from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient
from app.services.json_service import JsonService  
import json

class TextService:
    def __init__(self):
        gemini_client = GeminiChainClient(model_version='gemini-1.5-flash')
        self.query_processor = QueryProcessor(gemini_client)
        self.gemini_client = gemini_client
        self.json_service = JsonService() 

    def process_query(self, input_text: str):
        return "yes"
        response = self.query_processor.process_text_query(input_text)
        return response

    def process_scraping(self, url: str):
        response = self.query_processor.process_scraping(url)
        return response



    def confirm_response(self, user_response: str, system_question: str) -> bool:
        return "yes" in user_response.lower()
    
    def provide_hint(self, user_response: str, system_question: str) -> str:
        prompt = f"""
        System Question: {system_question}
        User Response: {user_response}

        As an AI assistant, provide a helpful hint to guide the user towards the correct answer. 
        The hint should:
        1. Not directly give away the answer
        2. Offer a new perspective or approach to think about the question
        3. Highlight any misconceptions in the user's response (if any)
        4. Encourage critical thinking


        Hint:
        """

        response = self.gemini_client.generate_text(prompt)
        
        if response:
            hint = response.strip()
        else:
            hint = "I apologize, but I couldn't generate a hint at the moment. Please try rephrasing your response or ask for clarification on the question."

        return hint


    def generate_task_steps(self, task: str):
        prompt = f"""
        -- **System Instructions:**
        -- You are an AI assistant with expertise in generating detailed task instructions in JSON format. 
        Your task is to provide a list of precise and clear steps for the given task. 

        Output format:
        Your output should be a JSON object with the following structure:
        {{
            "task": "<Task Description>",
            "steps": [
                "<Step 1>",
                "<Step 2>",
                ...
            ],
            "summary_task": "<Summary of the task>"
        }}
        Ensure the steps are clear, detailed, and can be easily followed.

        -- **Example Usage:**

        <EXAMPLE INPUT 1>
        -- User task: Create Hello World with Axios in React
        </EXAMPLE INPUT 1>
        <EXAMPLE OUTPUT 1>
        {{
            "task": "Create Hello World with Axios in React",
            "steps": [
            "Set up React project using 'npx create-react-app hello-world-app' and navigate to the project directory",
            "Install Axios with 'npm install axios'",
            "Create a simple component to fetch data: create 'HelloWorld.js', import Axios, define component, use 'useEffect' to fetch data, render data in component"
            ],
            "summary_task": "Create a React component that fetches and displays data using Axios."
        }}
        </EXAMPLE OUTPUT 1>

        <EXAMPLE INPUT 2>
        -- User task: Deploy a Node.js application on Heroku
        </EXAMPLE INPUT 2>
        <EXAMPLE OUTPUT 2>
        {{
            "task": "Deploy a Node.js application on Heroku",
            "steps": [
            "Ensure you have a Heroku account and the Heroku CLI installed",
            "Log in to your Heroku account using the command 'heroku login'",
            "Initialize a Git repository in your Node.js project directory if you haven't already",
            "Create a new Heroku app using the command 'heroku create'",
            "Define a 'Procfile' in the root of your project that specifies the command to run your app",
            "Add and commit all changes to your Git repository",
            "Deploy your application to Heroku by pushing your code to the Heroku remote with 'git push heroku main'",
            "Ensure that your application is running properly by visiting the Heroku URL provided"
            ],
            "summary_task": "Deploy a Node.js application to Heroku and ensure it is running correctly."
        }}
        </EXAMPLE OUTPUT 2>


        Task: {task}
        """
        print("step 2")
        response = self.gemini_client.generate_text(prompt)

        json_response = self.json_service.process_fix_json(response)  # json.loads(response)
        print(" --- json ", json_response)
        file_path = self.json_service.write_task_json('task_steps.json', json_response)
        return json_response, file_path

        self.json_service.write_task_json(task, json_response)

        return json_response