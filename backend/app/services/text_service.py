from app.core.query_processor import QueryProcessor
from app.core.gemini_client import GeminiChainClient
from app.services.json_service import JsonService  
import json
from typing import Dict

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
    def confirm_response(self, user_response: str, task_details: str, summary_task: str) -> bool:
        prompt = f"""
        -- **System Instructions:**
        -- You are an AI assistant specialized in evaluating user responses to confirm if a specific step in a task has been successfully completed.
        -- Your task is to determine whether the user has successfully completed the specific step described.
        -- analyzes the message {user_response}, if it fulfills or affirms that the current step {task_details} has been completed, that it fulfills the general task {summary_task}, respond with "yes"
        -- If the user indicates they have successfully completed the step or uses phrases like "yes", "next", "next step", "next steps", "I can", "I have", "I did", "Great job", "Well done", "Excellent work", "You did it", "Mission accomplished", "Fantastic", "Nicely done", "Good job", "You nailed it", "Success", "Task completed successfully", "Outstanding", "You rock", "Bravo", "Perfect", "You've outdone yourself", "Impressive", "Way to go", "You're amazing", "ready", "good", "complete", "done", "that's it", "okey", "ok", respond with "yes".
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
        Task: {summary_task}
        Step: {task_details}
        User Response: {user_response}

        -- **Your Task:**
        -- Determine if the user has successfully completed the specific task.
        -- Respond with "yes" if the step is completed successfully and "no" otherwise.

        Response:
        """

        response = self.gemini_client.generate_text(prompt)
        print(" ------- YES OR NO     - ", response)
        if response.strip().lower() in ["yes", "next", "next step", "next steps", "i can", "i have", "i did"]:
            return True
        else:
            return False





    def provide_hint(self, user_response: str, system_question: str, additional_info: Dict) -> str:
        summary_task = additional_info.get("summary_task", "No summary available")
        current_step = additional_info.get("current_step", "No current step available")
        relevant_history = additional_info.get("relevant_history", [])

        history_text = "\n".join(
            [f"{msg['role'].capitalize()}: {msg['content']}" for msg in relevant_history]
        )
        print("help hint into 1")

        prompt = """
-- **System Instructions:**
-- Act as an assistant to help understand a task at a specific step. Users will come to you because they encountered an error or have questions in their resolution, and you must help solve their problems and, if possible, provide more examples. Focus on the technology and programming area.
-- Your task is to provide a response that meets the following criteria:
1. Provide a direct answer if possible.
2. Offer a step-by-step approach to complete the task if a direct answer is not feasible or if the user requires more detail.
3. Identify and correct any misconceptions in the user's response (if any). If necessary, provide examples or links (links should be enclosed in ``).
4. Encourage efficient problem-solving and completion of this step.
5. If the topic is focused on programming or something where commands are required, insert correct code or commands in a single-line format. For simple commands, they should be enclosed in ``. For code or something more complex, it should be enclosed in ```<code here>```.
6. If you consult any web page, place the link/url at the end of the line for later consultation.
7. Remember the summary and current task, and that the user's question is about only one step of that task, but the final objective is that task.
        
        -- **Additional Information:**
        Summary Task: """+summary_task+"""
        Current Step: """+current_step+"""
        Relevant History:
        """+history_text+"""

        -- **Example Usage:**

<EXAMPLE INPUT 1>
-- **Additional Information:**
Summary Task: Learn how to perform Create, Read, Update, and Delete (CRUD) operations on a database using Python. This involves understanding the basic concepts, choosing a database library, establishing a connection, creating tables, inserting, retrieving, updating, and deleting data, committing changes, and closing the connection.
Current Step: Understanding the "Read" operation in CRUD.
Relevant History:
Assistant: Start by understanding the CRUD acronym: C - Create, R - Read, U - Update, D - Delete. These are the fundamental operations performed on data in any database management system.
User: what is read....read all or read a uniq?
Assistant: Hint: "Read" in CRUD refers to retrieving data from the database. This can be done in various ways, such as: 
- Reading all data: Fetching all records from a specific table. For example, you might want to read all customer records or all product details.
- Reading specific data: Reading certain records by filtering based on specific criteria. For example, all customer records with a specific postal code or all products within a particular price range.
- Reading data for a specific record: Retrieving data for a single record identified by its unique key or ID.

System Question: How do I read data from a database using Python?
User Response: I don't know where to start.
</EXAMPLE INPUT 1>
<EXAMPLE OUTPUT 1>
Hint: To read data from a database using Python, follow these steps:
1. **Install the required library**: Ensure you have `sqlite3` installed. For other databases like MySQL or PostgreSQL, you might need `mysql-connector-python` or `psycopg2`. You can install them using `pip install mysql-connector-python` or `pip install psycopg2`.
2. **Connect to the database**: Use the library to connect to your database. For example, with SQLite:
   ```python
   import sqlite3
   conn = sqlite3.connect('example.db')
   ```
3. **Create a cursor object**: This allows you to execute SQL queries.
   ```python
   cursor = conn.cursor()
   ```
4. **Execute a query to read data**: Use SQL `SELECT` statement to fetch data.
   ```python
   cursor.execute("SELECT * FROM table_name")
   rows = cursor.fetchall()
   for row in rows:
       print(row)
   ```
5. **Close the connection**: Always close the database connection after your operations.
   ```python
   conn.close()
   ```
</EXAMPLE OUTPUT 1>

<EXAMPLE INPUT 2>
-- **Additional Information:**
Summary Task: Learn how to set up a web server using Node.js.
Current Step: Installing Node.js.
Relevant History:
Assistant: Start by downloading the Node.js installer from the official website.
User: Which version should I download?
Assistant: Hint: Download the LTS (Long Term Support) version as it is more stable and suitable for most users.

System Question: How do I install Node.js on my computer?
User Response: I downloaded the installer, but I'm not sure what to do next.
</EXAMPLE INPUT 2>
<EXAMPLE OUTPUT 2>
Hint: To install Node.js on your computer, follow these steps:
1. **Run the installer**: Locate the downloaded Node.js installer file and double-click to run it.
2. **Follow the setup wizard**: The setup wizard will guide you through the installation process. Click "Next" to proceed.
3. **Accept the license agreement**: Read through the license agreement and click "I agree" if you accept the terms.
4. **Choose the installation path**: You can use the default installation path or choose a custom one. Click "Next" to continue.
5. **Select components**: The default components are usually sufficient. Click "Next" to proceed.
6. **Begin the installation**: Click "Install" to start installing Node.js on your computer.
7. **Finish the setup**: Once the installation is complete, click "Finish" to close the setup wizard.
8. **Verify the installation**: Open a terminal or command prompt and type `node -v` and `npm -v` to check that Node.js and npm were installed correctly.
</EXAMPLE OUTPUT 2>



        System Question: """+system_question+"""
        User Response: """+user_response+"""

        -- **Your Task:**
        -- Provide a detailed and helpful hint or direct answer for the user. Ensure the response adheres to the criteria outlined above.

        Hint:
        """
        print("help hint into 2")

        response = self.gemini_client.generate_text(prompt)
        print("help hint into 3")

        if response:
            hint = response.strip()
        else:
            hint = "I apologize, but I couldn't generate a hint at the moment. Please try rephrasing your response or ask for clarification on the question."

        return hint



    def generate_task_steps(self, task: str):
        prompt = f"""
        -- **System Instructions:**
        -- You are an AI assistant with expertise in generating detailed task instructions in JSON format. 
        -- Your task is to provide a list of precise and clear steps for the given task. 
        -- If the topic is focused on programming or something where commands are required, insert correct commands in single-line format.
        -- If you consult any page, put the link at the end of the line to consult it later

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
        -- Ensure the steps are clear, detailed, and can be easily followed. 
        -- If there is any explanation, put everything in a single line, where at the end there is an instruction, do not leave loose sentences, each line is a step that the user must follow.
        -- Avoid using titles or subtitles in one line, If there are cases where there are titles or subtitles, it includes everything in a single line.
        -- If you make an explanation that must use commands or code, with the explanation add an example of the code, all in a single line, repeating the line breaks and tabs for the order of the code. At the end of the instructions add the complete code that you explained with explanatory comments on each line of code.

        -- **Example Usage:**

        <EXAMPLE INPUT 1>
        -- User task: Create Hello World with Axios in React
        </EXAMPLE INPUT 1>
        <EXAMPLE OUTPUT 1>
        {{
            "task": "Create Hello World with Axios in React",
            "steps": [
            "Set up React project using `npx create-react-app hello-world-app` and navigate to the project directory",
            "Install Axios with `npm install axios`",
            "Create a simple component to fetch data: create `HelloWorld.js`, import Axios, define component, use `useEffect` to fetch data, render data in component"
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
            "Log in to your Heroku account using the command `heroku login`",
            "Initialize a Git repository in your Node.js project directory if you haven't already",
            "Create a new Heroku app using the command `heroku create`",
            "Define a `Procfile` in the root of your project that specifies the command to run your app",
            "Add and commit all changes to your Git repository",
            "Deploy your application to Heroku by pushing your code to the Heroku remote with `git push heroku main`",
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
                "Step 1: Sign up for a Google AI Studio account and create an API key by visiting ai.google.dev, clicking `Gemini API`, and then `Get API key`.",
                "Step 2: Sign into your Google account to access the API key creation page.",
                "Step 3: Click `Create API key` to generate a new API key.",
                "Step 4: Explore the Gemini Playground by clicking `Create new prompt` and then `Chat prompt`. Experiment with different prompts and parameters in the Playground to customize the chatbot`s persona, style, and tone.",
                "Step 5: Instruct the model to take on a specific role, such as a formal assistant, an expert in a field, or a specific character.",
                "Step 6: Set the model`s parameters in the Playground, including the model selection (Gemini 1.5 Flash, Gemini 1.5 Pro), token count, temperature, safety settings, and output format.",
                "Step 7: Access the code for integrating Gemini into an application by clicking `Get code` in the Playground.",
                "Step 8: Install the Google generative AI Library using `pip install google-generative-ai`.",
                "Step 10: Create and activate a virtual environment for best programming practice.",
                "Step 11: Create a new Python file named `chat.py`. Copy the code from the Playground into the `chat.py` file.",
                "Step 13: Load your API key from the Gemini console. Create a new file named `.env` to store your API key as an environment variable.",
                "Step 15: Install the `python-dotenv` library using `pip install python-dotenv`. Import the `python-dotenv` library in `chat.py` and load the API key from the `.env` file.",
                "Step 17: Adjust the parameters in the code, such as temperature, max tokens, response type, and safety settings.",
                "Step 18: Create the model using `gen.generative_model` with the desired model name, parameters, and system instructions.",
                "Step 19: Start a chat session using `model.start_chat` and provide an empty list as the `history` parameter.",
                "Step 20: Use a `while` loop to continuously interact with the chatbot.",
                "Step 21: Get user input and send it to the chatbot using `chat_session.message`.",
                "Step 22: Retrieve the chatbot's response using `response.text`.",
                "Step 23: Update the `history` object to maintain a record of the conversation by appending dictionaries with user and model inputs and responses. Print the chatbot's response.",
                "Step 25: Run the `chat.py` file using `python chat.py` to start a conversation with the chatbot."
            ],
            "summary_task": "This video provides a step-by-step tutorial on using the Gemini API with Python to build a custom chatbot. It starts by explaining how to sign up for a Google AI Studio account and obtain an API key. The video then demonstrates using the Gemini Playground to experiment with different prompts and parameters, including setting the model's persona, style, and safety settings. It shows how to integrate the Gemini API into a Python application and create a simple chatbot that can hold a conversation. The tutorial emphasizes the importance of updating the conversation history to maintain context and create a more engaging experience. The video concludes by highlighting the potential for building more complex chatbots using the Gemini API and encourages viewers to experiment with different features. \n"
        }}
        </EXAMPLE OUTPUT 3>

        <EXAMPLE INPUT 4>
        -- User task: I want to learn the bubble sort algorithm in c++
        </EXAMPLE INPUT 4>
        <EXAMPLE OUTPUT 4>
        {{
            "task": "I want to learn the bubble sort algorithm in c++",
            "steps": [
                "Understand the basic concept of bubble sort: It repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The largest element bubbles up to the end of the list with each pass, hence the name 'bubble sort'.",
                "Define a function in C++ that takes an array as input: ```void bubbleSort(int arr[], int n) {{ ... }}```",
                "Iterate through the array: ```for (int i = 0; i < n - 1; i++) {{ ... }}```",
                "For each pass, iterate through the array again but stop one element before the end: ```for (int j = 0; j < n - i - 1; j++) {{ ... }}```",
                "Compare adjacent elements: ```if (arr[j] > arr[j + 1]) {{ ... }}```",
                "Swap elements if they are in the wrong order: ```int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;```",
                "Print the sorted array after the sorting process: ```for (int i = 0; i < n; i++) {{ cout << arr[i] << ' '; }}```",
                "Test the bubble sort function with sample input and print the output"
                "Test the bubble sort function with sample input and print the output, \nHere is the complete function with comments: ```/* void bubbleSort(int arr[], int n) {{ for (int i = 0; i < n - 1; i++) {{ // Iterate through the array for (int j = 0; n - i - 1; j++) {{ // For each pass, iterate again but stop one element before the end if (arr[j] > arr[j + 1]) {{ // Compare adjacent elements int temp = arr[j]; // Swap elements if they are in the wrong order arr[j] = arr[j + 1]; arr[j + 1] = temp; }} }} }} }} // Bubble Sort: Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order */```"
            ],
            "summary_task": "Learn the bubble sort algorithm in C++ by understanding its concept, implementing it in a function, and testing it with sample input."        
        }}
        </EXAMPLE OUTPUT 4>

        <EXAMPLE INPUT 5>
        -- User task: Node.js Crash Course Setup
        </EXAMPLE INPUT 5>
        <EXAMPLE OUTPUT 5>
        {{
            "task": "Node.js Crash Course Setup  ",
            "steps": [
                "Step 1: Open a terminal or command prompt on your computer.",
                "Step 2: Check if Node.js is installed by typing `node -v` in the terminal. If you get a version number, Node.js is installed.",
                "Step 3: If Node.js is not installed, download the latest version from the official Node.js website: `https://nodejs.org/.`",
                "Step 4: Run the downloaded installer to install Node.js on your computer. This usually takes a couple of minutes.",
                "Step 5: After installation, open a new terminal window and run `node -v` again to verify the installation.",
                "Step 6: If you have an older version of Node.js, consider updating it to the latest version.",
                "Step 7: Choose a text editor of your preference. The tutorial uses VS Code (Visual Studio Code), which is a free and popular editor available at `https://code.visualstudio.com/.`",
                "Step 8: Download and install your chosen text editor.",
                "Step 9: Create a new project folder in your chosen text editor. This tutorial creates a folder named `node-crash-course`.",
                "Step 10: Navigate to the project folder using your terminal. You can use `cd Documents` (replace `Documents` with the appropriate path) to change directories.",
                "Step 11: Use `mkdir node-crash-course` to create the project folder.",
                "Step 12: Change to the project folder using `cd node-crash-course`.",
                "Step 13: Open the project folder in your text editor. For VS Code, use `code .` in the terminal to open the current directory.",
                "Step 14: Create a new file within the project folder and name it `test.js`.",
                "Step 15: Write some basic JavaScript code in `test.js`. The example uses `const name = 'Mario'; console.log(name);`.",
                "Step 16: Run the `test.js` file in your terminal using `node test`.",
                "Step 17: Verify that the output `Mario` is displayed in the terminal, confirming that the JavaScript code is running.",
                "Step 18: Modify the code in `test.js` and run `node test` again to see the updated output.",
                "Step 19: For further learning, download the course files from the GitHub repository: `https://github.com/your-username/node-crash-course.`",
                "Step 20: Explore the course files for each lesson by navigating to the corresponding branches on GitHub."
            ],
            "summary_task": "This video is an introduction to Node.js, a JavaScript runtime environment that allows developers to run JavaScript code outside of a web browser. The video explains how Node works by wrapping the V8 engine, which compiles JavaScript into machine code, enabling it to run directly on computers and servers. \n\nThe video then delves into the practical applications of Node.js in web development, specifically its role in handling backend requests and responses, creating dynamic websites, and interacting with databases. \n\nIt highlights the advantages of Node.js, such as using JavaScript for both frontend and backend development, a large community, and numerous third-party packages. \n\nThe video concludes by outlining the course curriculum, which covers installing Node, reading and writing files, creating servers, using Express for web development, working with MongoDB databases, and implementing EJS template engines. \n\nThe final project involves building a simple blog website using these technologies. The video emphasizes that prior knowledge of JavaScript, HTML, and CSS is recommended for this course. \n"
        }}
        </EXAMPLE OUTPUT 5>

        <EXAMPLE INPUT 6>
        -- User task: React App Setup
        </EXAMPLE INPUT 6>
        <EXAMPLE OUTPUT 6>
        {{
            "task": "React App Setup  ",
            "steps": [
                "Step 1: Ensure you have Node.js installed on your computer. You can check the version by opening your terminal and typing `node -v` and pressing enter. If you don't see a version number or your version is less than 5.2, download the latest version from `https://nodejs.org/.`",
                "Step 2: Navigate to the directory where you want to create your project using the command `cd` followed by the directory path in your terminal. For example, you might use `cd Documents/tuts` to navigate to a `tuts` folder inside your Documents folder.",
                "Step 3: Create your React project by running the command `npx create-react-app <project-name>` in your terminal, replacing `<project-name>` with the name you want for your project. For example, you might use `npx create-react-app dojo-blog`.",
                "Step 4: Once the project creation is complete, navigate into your project directory using the command `cd <project-name>`. For example, you might use `cd dojo-blog`.",
                "Step 5: Open your project in VS Code by running the command `code .` in your terminal.",
                "Step 6: Get familiar with the project structure. The `node_modules` folder contains your project dependencies, including the React library. The `public` folder contains public files, including `index.html`, which is served to the browser. The `src` folder contains the majority of your code, including the `App.js` component.",
                "Step 7:  Delete the `logo.svg`, `reportWebVitals.js`, and `setupTests.js` files as they are not necessary for this tutorial. Also, delete the imports related to those files from `index.js`.",
                "Step 8: Run the command `npm run start` in your terminal to start the development server and preview your application in a browser. The address will be displayed in your terminal, typically `localhost:3000`.",
                "Step 9: If you ever need to reinstall your project dependencies, run the command `npm install` in your terminal. This will create the `node_modules` folder and install all the necessary dependencies.",
                "Step 10: Remember that project files downloaded from GitHub may not include the `node_modules` folder. If you download a project, you must run `npm install` to re-install the dependencies before you can start the project."
            ],
            "summary_task": "This video explains how to set up a React starter project using Create React App. It covers the following steps:\n\n1. **Installing Node.js:**  The tutorial emphasizes the importance of having Node.js (version 5.2 or later) installed, which is required for using `npx`.\n2. **Creating the React Project:**  The process of using `npx create-react-app` to generate a new React project is demonstrated. \n3. **Exploring the Project Structure:**  The video walks through the different folders and files in the created project, explaining their purpose. \n   * **`node_modules`:** Contains all project dependencies.\n   * **`public`:**  Holds public files, including `index.html`.\n   * **`src`:**  Contains the main React code, including the `app.js` component and `index.js` (which starts the application).\n4. **Running the Project:** The tutorial explains how to start a development server using `npm run start`, which previews the project in a browser.\n5. **Node Modules and Project Dependencies:** The video highlights that the `node_modules` folder might be missing when downloading projects from Github. It explains how to restore it using `npm install`.\n6. **Next Steps:** The video ends with a preview of what will be covered in the next tutorial, focusing on React components and templates.\n\nOverall, this video provides a solid foundation for beginners wanting to learn React by setting up their first project and understanding its basic structure. \n"
        }}
        </EXAMPLE OUTPUT 6>

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
