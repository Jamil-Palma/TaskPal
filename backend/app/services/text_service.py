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



    #def confirm_response(self, user_response: str, system_question: str) -> bool:
    #    return "yes" in user_response.lower()
    def confirm_response(self, user_response: str, task_details: str) -> bool:
        prompt = f"""
        -- **System Instructions:**
        -- You are an AI assistant specialized in evaluating user responses to confirm if a specific step in a task has been successfully completed.
        -- Your task is determinar si el usuario ha completado con éxito el paso específico descrito.
        -- If the user indicates they have successfully completed the step or uses phrases like "yes", "next", "next step", "next steps", "I can", "I have", "I did", respond with "yes".
        -- If the user has questions, shows errors, or expresses doubts, respond with "no".
        
        -- **Example Usage:**

        ### Example 1
        Task: How to bake a cake
        Step: "Beat in the eggs, one at a time, then stir in the vanilla."
        User Response: I beat in the eggs and stirred in the vanilla as instructed.
        Response: yes

        ### Example 2
        Task: How to change a tire
        Step: "Loosen the lug nuts."
        User Response: I'm having trouble loosening the lug nuts. They are too tight.
        Response: no

        ### Example 3
        Task: How to cook rice
        Step: "Rinse the rice under cold water."
        User Response: I rinsed the rice thoroughly under cold water.
        Response: yes

        ### Example 4
        Task: How to play piano
        Step: "Learn basic posture and hand position."
        User Response: I'm not sure if my hand position is correct. Can you help?
        Response: no

        ### Example 5
        Task: How to play piano
        Step: "Learn basic posture and hand position."
        User Response: Yes, next steps please.
        Response: yes

        ### Example 6
        Task: How to play piano
        Step: "Learn basic posture and hand position."
        User Response: Next step.
        Response: yes

        ### Example 7
        Task: How to play piano
        Step: "Start with simple pieces."
        User Response: O yeah, I can play a simple song.
        Response: yes

        ### Example 8
        Task: How to play piano
        Step: "Start with simple pieces."
        User Response: I have played a simple song already.
        Response: yes

        -- **Current Task:**
        Task: {task_details}
        Step: {task_details}
        User Response: {user_response}

        -- **Your Task:**
        -- Determine if the user has successfully completed the specific step.
        -- Respond with "yes" if the step is completed successfully and "no" otherwise.

        Response:
        """

        response = self.gemini_client.generate_text(prompt)
        print(" ------- YES OR NO     - ", response)
        if response.strip().lower() in ["yes", "next", "next step", "next steps", "i can", "i have", "i did"]:
            return True
        else:
            return False




    def provide_hint(self, user_response: str, system_question: str) -> str:
        prompt = f"""
        -- **System Instructions:**
        -- You are an AI assistant specialized in providing detailed guidance and direct answers to help users complete tasks effectively.
        -- Your task is to provide a response that meets the following criteria:
        1. Provides a direct answer if possible.
        2. Offers a step-by-step approach to complete the task if a direct answer is not feasible.
        3. Identifies and corrects any misconceptions in the user's response (if any).
        4. Encourages efficient problem-solving and task completion.

        -- **Example Usage:**

        <EXAMPLE INPUT 1>
        System Question: How do I reset my email password?
        User Response: I don't know where to start.
        </EXAMPLE INPUT 1>
        <EXAMPLE OUTPUT 1>
        Hint: To reset your email password, follow these steps:
        1. Go to the email provider's login page.
        2. Click on the "Forgot Password" link.
        3. Enter your email address and submit the form.
        4. Check your email for a password reset link and follow the instructions.
        5. Create a new password and save the changes.
        </EXAMPLE OUTPUT 1>

        <EXAMPLE INPUT 2>
        System Question: How can I install Python on my computer?
        User Response: I tried downloading it but got confused.
        </EXAMPLE INPUT 2>
        <EXAMPLE OUTPUT 2>
        Hint: To install Python on your computer, follow these steps:
        1. Go to the official Python website (python.org).
        2. Navigate to the Downloads section.
        3. Choose the appropriate version for your operating system (Windows, macOS, or Linux).
        4. Download the installer and run it.
        5. Follow the installation prompts, ensuring you check the option to add Python to your PATH.
        6. Verify the installation by opening a command prompt or terminal and typing `python --version`.
        </EXAMPLE OUTPUT 2>

        <EXAMPLE INPUT 3>
        System Question: What is the process for photosynthesis?
        User Response: I think it's when plants breathe.
        </EXAMPLE INPUT 3>
        <EXAMPLE OUTPUT 3>
        Hint: Photosynthesis is the process by which plants convert light energy into chemical energy. Here are the steps:
        1. Chlorophyll in the plant cells absorbs sunlight.
        2. The plant takes in carbon dioxide from the air through its leaves.
        3. Water is absorbed by the roots and transported to the leaves.
        4. Using the sunlight's energy, the plant converts carbon dioxide and water into glucose and oxygen.
        5. The glucose is used by the plant for energy and growth, and the oxygen is released into the atmosphere.
        </EXAMPLE OUTPUT 3>


        System Question: {system_question}
        User Response: {user_response}

        -- **Your Task:**
        -- Provide a detailed and helpful hint or direct answer for the user. Ensure the response adheres to the criteria outlined above.

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
        #print(" --- json ", json_response)
        file_path = self.json_service.write_task_json('task_steps.json', json_response)
        return json_response, file_path

        self.json_service.write_task_json(task, json_response)

        return json_response