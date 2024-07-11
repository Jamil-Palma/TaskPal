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
        5. Avoid using titles or subtitles in one line, If there are cases where there are titles or subtitles, it includes everything in a single line.
        6. If the topic is focused on programming or something where commands are required, insert correct code or commands in single-line format.
        7. If you consult any page, put the link at the end of the line to consult it later.

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
        If the topic is focused on programming or something where commands are required, insert correct commands in single-line format.
        If you consult any page, put the link at the end of the line to consult it later

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
        Avoid using titles or subtitles in one line, If there are cases where there are titles or subtitles, it includes everything in a single line.

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

        <EXAMPLE INPUT 3>
        -- User task: Gemini API Chatbot with Python
        </EXAMPLE INPUT 3>
        <EXAMPLE OUTPUT 3>
        {{
            "task": "Gemini API Chatbot with Python  ",
            "steps": [
                "Step 1: Sign up for a Google AI Studio account and create an API key by visiting ai.google.dev, clicking 'Gemini API', and then 'Get API key'.",
                "Step 2: Sign into your Google account to access the API key creation page.",
                "Step 3: Click 'Create API key' to generate a new API key.",
                "Step 4: Explore the Gemini Playground by clicking 'Create new prompt' and then 'Chat prompt'.",
                "Step 5: Experiment with different prompts and parameters in the Playground to customize the chatbot's persona, style, and tone.",
                "Step 6: Instruct the model to take on a specific role, such as a formal assistant, an expert in a field, or a specific character.",
                "Step 7: Set the model's parameters in the Playground, including the model selection (Gemini 1.5 Flash, Gemini 1.5 Pro), token count, temperature, safety settings, and output format.",
                "Step 8: Access the code for integrating Gemini into an application by clicking 'Get code' in the Playground.",
                "Step 9: Install the Google generative AI Library using 'pip install google-generative-ai'.",
                "Step 10: Create and activate a virtual environment for best programming practice.",
                "Step 11: Create a new Python file named 'chat.py'.",
                "Step 12: Copy the code from the Playground into the 'chat.py' file.",
                "Step 13: Load your API key from the Gemini console.",
                "Step 14: Create a new file named '.env' to store your API key as an environment variable.",
                "Step 15: Install the 'python-dotenv' library using 'pip install python-dotenv'.",
                "Step 16: Import the 'python-dotenv' library in 'chat.py' and load the API key from the '.env' file.",
                "Step 17: Adjust the parameters in the code, such as temperature, max tokens, response type, and safety settings.",
                "Step 18: Create the model using 'gen.generative_model' with the desired model name, parameters, and system instructions.",
                "Step 19: Start a chat session using 'model.start_chat' and provide an empty list as the 'history' parameter.",
                "Step 20: Use a 'while' loop to continuously interact with the chatbot.",
                "Step 21: Get user input and send it to the chatbot using 'chat_session.message'.",
                "Step 22: Retrieve the chatbot's response using 'response.text'.",
                "Step 23: Update the 'history' object to maintain a record of the conversation by appending dictionaries with user and model inputs and responses.",
                "Step 24: Print the chatbot's response.",
                "Step 25: Run the 'chat.py' file using 'python chat.py' to start a conversation with the chatbot."
            ],
            "summary_task": "This video provides a step-by-step tutorial on using the Gemini API with Python to build a custom chatbot. It starts by explaining how to sign up for a Google AI Studio account and obtain an API key. The video then demonstrates using the Gemini Playground to experiment with different prompts and parameters, including setting the model's persona, style, and safety settings. It shows how to integrate the Gemini API into a Python application and create a simple chatbot that can hold a conversation. The tutorial emphasizes the importance of updating the conversation history to maintain context and create a more engaging experience. The video concludes by highlighting the potential for building more complex chatbots using the Gemini API and encourages viewers to experiment with different features. \n"
        }}
        </EXAMPLE OUTPUT 3>

        -- **User Task:**
        -- {task}


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