import os
import textwrap
import PIL.Image
import mimetypes
from dotenv import load_dotenv
import google.generativeai as genai
from IPython.display import Markdown
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
import json
import pyaudio
import wave
import requests
from bs4 import BeautifulSoup


class GeminiChainClient:
    def __init__(self, model_version: str):
        """
        Initialize the client with the specific model version.
        """
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "API_KEY is missing from the environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_version)
        self.langchain_model = ChatGoogleGenerativeAI(temperature=0.0, google_api_key=api_key, model=model_version)

    @staticmethod
    def to_markdown(text):
        """
        Convert text to Markdown format.
        """
        text = text.replace('•', '  *')
        return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

    def generate_text(self, input_text: str):
        """
        Generate text based on input text.
        """
        try:
            print("Input text received:", input_text)
            
            response = self.model.generate_content(input_text)
            
            print("Model response received:", response)
            print("Generated text:", response.text)
            
            return response.text
        except AttributeError as e:
            print("AttributeError:", e)
            return "An error occurred: Attribute not found."
        except Exception as e:
            print("An unexpected error occurred:", e)
            return "An unexpected error occurred."


    def generate_text_from_image(self, filename: str, task: str, input_text: str):
        """
        Generate text based on an input image, considering the task context.
        """
        prompt = f"""You are an AI assistant specializing in image analysis and task-specific problem-solving.
        The current task context is: {task}
        The user's query is: {input_text}

        Analyze the given image and respond with a JSON object containing the following:
        1. "relevance": A boolean indicating if the image is relevant to the task context.
        2. "analysis": If relevant, provide a detailed analysis of the image content related to the task. If not relevant, leave this field empty.
        4. "solution": If relevant and the image shows a problem, provide a solution or next steps. If not relevant or no problem is evident, leave this field empty.

        Ensure your response is in valid JSON format.
        """
        img = PIL.Image.open(filename)
        response = self.model.generate_content([prompt, img])
        token = response.usage_metadata.candidates_token_count
        total_tokens = response.usage_metadata.total_token_count
        print(f"Response token: {token}")
        print(f"Total tokens: {total_tokens}")

        return response.text

    def speech_to_text(self, audio_path: str):
        """
        Convert speech to text.
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError("Audio file not found!")

        with open(audio_path, 'rb') as audio_file:
            audio_data = audio_file.read()

        audio = {
            "inline_data": {
                "data": audio_data,
                "mime_type": mimetypes.guess_type(audio_path)[0]
            }
        }
        prompt = "Extract text from this audio."
        response = self.model.generate_content([audio, prompt])
        return response.text

    def record_audio(self, duration=5, sample_rate=16000, channels=1, chunk=1024):
        # Initialize PyAudio
        p = pyaudio.PyAudio()

        # Open stream
        stream = p.open(format=pyaudio.paInt16,
                        channels=channels,
                        rate=sample_rate,
                        input=True,
                        frames_per_buffer=chunk)

        print("Recording...")

        frames = []
        for _ in range(0, int(sample_rate / chunk * duration)):
            data = stream.read(chunk)
            frames.append(data)

        print("Recording finished.")

        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        p.terminate()

        # Save the recorded data as a WAV file
        temp_filename = "temp_audio.wav"
        wf = wave.open(temp_filename, 'wb')
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))
        wf.close()

        # Transcribe the audio using GeminiChainClient
        transcribed_text = self.speech_to_text(temp_filename)

        # Clean up the temporary file
        os.remove(temp_filename)

        return transcribed_text

    def process_scraping(self, url: str):
        """
        Process scraping based on the input URL.
        """
        page = requests.get(url.input_text)
        soup = BeautifulSoup(page.content, 'html.parser')
        title_string_prompt = "Review this user-assigned task and provide a clear, easily understandable title of no more than 5 words, you use alfabets characters and no line breaks. user input:" + url.input_text
        title = self.generate_text(title_string_prompt)
        print("TITULO QUE GENERA ", title)
        # title = soup.title.text
        # title = title.replace("-", "").replace(" ", "_")
        article_text = " ".join([p.text for p in soup.find_all('p')])
        prompt = f"""
-- **System Instructions:**
-- You are an expert IT instructor with expertise in generating detailed task instructions in JSON format. Your task is to provide a list of precise and clear steps for the given task described in the article_text. Ensure the steps are very detailed, providing all necessary information, including any commands, code snippets, or technical details mentioned in the text. Each step must be a complete string, ensuring the user can follow the instructions without needing additional resources. If the task must use external sources like creating an API key, please provide the URL link to complete that task.

Format your response as a JSON object with the following structure:
{{
    "task": "<Task Description>",
    "steps": [
        "<Step 1>",
        "<Step 2>",
        ...
    ],
    "summary_task": "<Summary of the task>"
}}

Guidelines for creating steps:
1. Each step should be a complete, detailed instruction.
2. Include any relevant commands, enclosing them in backticks (`).
3. Include any relevant URLs, enclosing them in backticks (`).
4. For code snippets, use triple backticks (```) with the appropriate language specified, e.g., ```python``` for Python code.
5. Provide examples where appropriate.
6. Ensure each step can be followed without needing additional resources.

-- Example output:
    "steps": [
        "Step 1: Install the required packages and set up the environment. You can use pip install langchain openai sqlalchemy.",
        "Step 2: Create the Chinook.db file in the same directory as your notebook. You can download it from `https://github.com/lerocha/chinook-database.` You'll need to create a SQLite connection using the SQLAlchemy-driven SQLDatabase class. Here's an example: `db = SQLDatabase.from_uri(\"sqlite:///Chinook.db\")`",
        "Step 3:  Create an OpenAI chat model and an \"openai-tools\" agent using the `create_sql_agent` constructor. Use the `SQLDatabaseToolkit` to help with table selection and schema inclusion. Here's an example: `agent = create_sql_agent(db, llm=ChatOpenAI(temperature=0), tools=SQLDatabaseToolkit(db), verbose=True)`",
        "Step 4: To optimize performance, create a few-shot prompt with domain-specific knowledge. This will help the model make better queries by providing examples of queries and their corresponding results. First, gather a few user input-SQL query examples. Then, create a SemanticSimilarityExampleSelector to find the examples most similar to the user's input. Finally, create a FewShotPromptTemplate using the example selector, an example prompt, and a prefix and suffix for the formatted examples. Here's an example: `example_selector = SemanticSimilarityExampleSelector.from_examples(examples, retriever=ExampleRetriever(embedding_function=OpenAIEmbeddings()))`, `few_shot_prompt_template = FewShotPromptTemplate(example_selector=example_selector, example_prompt=\"\"\"{{user_input}} \nSQL Query: {{query}}\"\"\", prefix=\"Here are some example queries and their corresponding SQL statements:\n\", suffix=\"What is the SQL query for this question: {{user_input}}\")`",
        "Step 5: Create a custom prompt with a human message template and an agent_scratchpad MessagesPlaceholder. Use the few-shot prompt template for the system message. This will provide the agent with context and examples for understanding the user's request. Here's an example: `prompt = ChatPromptTemplate.from_template(\"{{user_input}} \n\n{{agent_scratchpad}}\")`, `agent = create_sql_agent(db, llm=ChatOpenAI(temperature=0), tools=SQLDatabaseToolkit(db), verbose=True, prompt=prompt)`",
        "Step 6: To filter data based on proper nouns like addresses, song names, or artists, create a vector store containing all the distinct proper nouns from the database. Use the `create_sql_agent` constructor to pass in the vector store as a tool for the agent. This will allow the agent to query the vector store for the correct spelling of a proper noun before building the SQL query. Here's an example: `retriever = VectorStore.from_embeddings(embeddings, OpenAIEmbeddings())`, `agent = create_sql_agent(db, llm=ChatOpenAI(temperature=0), tools=[SQLDatabaseToolkit(db), retriever], verbose=True)`"
    ],

<EXAMPLE INPUT 2>
-- **Article Text:**
SQLite is famous for its great feature zero-configuration, which means no complex setup or administration is needed. This chapter will take you through the process of setting up SQLite on Windows, Linux and Mac OS X.

Install SQLite on Windows
    Step 1 - Go to SQLite download page, and download precompiled binaries from Windows section.
    Step 2 - Download sqlite-shell-win32-*.zip and sqlite-dll-win32-*.zip zipped files.
    Step 3 - Create a folder C:\\sqlite and unzip above two zipped files in this folder, which will give you sqlite3.def, sqlite3.dll and sqlite3.exe files.
    Step 4 - Add C:\\sqlite in your PATH environment variable and finally go to the command prompt and issue sqlite3 command, which should display the following result.
    C:\\sqlite3
    SQLite version 3.7.15.2 2013-01-09 11:53:05
    Enter ".help" for instructions
    Enter SQL statements terminated with a ";"
    sqlite>

Install SQLite on Linux
    Today, almost all the flavours of Linux OS are being shipped with SQLite. So you just issue the following command to check if you already have SQLite installed on your machine.
    $sqlite3
    SQLite version 3.7.15.2 2013-01-09 11:53:05
    Enter ".help" for instructions
    Enter SQL statements terminated with a ";"
    sqlite>
    If you do not see the above result, then it means you do not have SQLite installed on your Linux machine. Following are the following steps to install SQLite -
    Step 1 - Go to SQLite download page and download sqlite-autoconf-*.tar.gz from source code section.
    Step 2 - Run the following command -
    $tar xvfz sqlite-autoconf-3071502.tar.gz
    $cd sqlite-autoconf-3071502
    $./configure --prefix=/usr/local
    $make
    $make install
    The above command will end with SQLite installation on your Linux machine. Which you can verify as explained above.

Install SQLite on Mac OS X
    Though the latest version of Mac OS X comes pre-installed with SQLite but if you do not have installation available then just follow these following steps -
    Step 1 - Go to SQLite download page, and download sqlite-autoconf-*.tar.gz from source code section.
    Step 2 - Run the following command -
    $tar xvfz sqlite-autoconf-3071502.tar.gz
    $cd sqlite-autoconf-3071502
    $./configure --prefix=/usr/local
    $make
    $make install
    The above procedure will end with SQLite installation on your Mac OS X machine. Which you can verify by issuing the following command −
    $sqlite3
    SQLite version 3.7.15.2 2013-01-09 11:53:05
    Enter ".help" for instructions
    Enter SQL statements terminated with a ";"
    sqlite>

Finally, you have SQLite command prompt where you can issue SQLite commands for your exercises.
</EXAMPLE INPUT 2>
<EXAMPLE OUTPUT 2>
{{
    "task": "Install SQLite on Windows, Linux, and Mac OS X",
    "steps": [
        "Step 1: Download SQLite binaries: Go to the SQLite download page at `https://www.sqlite.org/download.html` and download the precompiled binaries for Windows, the `sqlite-shell-win32-*.zip` and `sqlite-dll-win32-*.zip` files. For Linux and Mac OS X, download the `sqlite-autoconf-*.tar.gz` from the source code section.",
        "Step 2: Extract the files: On Windows, create a directory `C:\\\\sqlite` and unzip the downloaded files into this folder. For Linux and Mac OS X, use the following commands to extract and prepare the files: ```\ntar xvfz sqlite-autoconf-3071502.tar.gz\ncd sqlite-autoconf-3071502\n./configure --prefix=/usr/local\nmake\nsudo make install\n```",
        "Step 3: Update PATH environment variable: On Windows, add `C:\\\\sqlite` to your PATH environment variable. On Linux and Mac OS X, the installation process typically handles this step, but you can verify by checking your environment settings.",
        "Step 4: Verify the installation: Open a terminal or command prompt and type `sqlite3` to verify the installation. You should see the SQLite version information displayed, such as: ```\nSQLite version 3.7.15.2 2013-01-09 11:53:05\nEnter \".help\" for instructions\nEnter SQL statements terminated with a \";\"\nsqlite>\n```"
    ],
    "summary_task": "Install SQLite on Windows, Linux, and Mac OS X by downloading the binaries, extracting them, updating the PATH environment variable, and verifying the installation."
}}
</EXAMPLE OUTPUT 2>


-- article_text: 
"{article_text}"

Article Content:
"""

        prompt_summary = """You are an AI language model. Please summarize the following text \
        in no more than one paragraph.

        ## Article Content:
        """ + article_text
        summary = self.model.generate_content(prompt_summary)

        task_prompt = """You are an AI language model. I'll provide you a summary of a text. \
        Your task is to generate one short name for the task based on the summary.""" + summary.text

        response = self.model.generate_content(prompt)
        task_name = self.model.generate_content(task_prompt)
        return {"Title": title, "Response": response.text, "Task Name": task_name.text, "Summary": summary.text}

    def video_transcript(self, video_path: str):
        """
        Get transcript from YouTube url.
        """
        page = requests.get(video_path)
        soup = BeautifulSoup(page.text, 'html.parser')
        title = soup.find("meta", itemprop="name")['content']
        title = title.replace("-", "").replace(" ", "_")

        if ("youtu.be" in video_path):
            video_id = video_path.split('be/')[1].split('?')[0]
        else:
            video_id = video_path.split('v=')[-1]

        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = ' '.join([d['text']
                            for d in transcript_list]).replace('\n', ' ')
        return {"transcript": transcript, "title": title}
    
    def video_transcript_instructions(self, transcript: str, title: str):
        prompt = """
        -- **System Instructions:**
        -- You are an AI assistant with expertise in generating detailed task instructions in JSON format. 
        -- Your task is to provide a list of precise and clear steps for the given task described in the video transcript (use the information provided in the <video_transcript> section). Ensure the steps are very detailed, providing all necessary information, including any commands, code snippets, or technical details mentioned in the transcript. Each step must be a complete string, ensuring the user can follow the instructions without needing additional resources. \
        -- If the task must use external sources like creating an API key, please provide the url link to complete that task, and enclose the link with ` `.

        Context:
        -- The user has provided a video transcript (<video_transcript> section) and a title. Your job is to extract the key tasks and convert them into a step-by-step guide. The steps should cover everything from setup to completion, including any relevant tools, commands, or code. Each step should be standalone and formatted as a complete sentence or set of sentences.

        Output format:
        Your output should be a JSON object with the following structure:
        {
            "task": "<Task Description>",
            "steps": [
                "<Step 1>",
                "<Step 2>",
                ...
            ],
            "summary_task": "<Summary of the task>"
        }
        Ensure the steps are clear, detailed, and can be easily followed.

        -- **Example Usage:**

        <EXAMPLE INPUT 1>
        <video_transcript>
        "First, set up a new React project using `npx create-react-app hello-world-app` and navigate to the project directory by running `cd hello-world-app`. 
        Next, install Axios with `npm install axios`. 
        Then, create a new file named `HelloWorld.js` in the `src` directory and import Axios by adding `import axios from `axios`;` at the top. 
        Define a functional component named `HelloWorld` with `const HelloWorld = () => {{}}`. 
        Use the `useEffect` hook to fetch data from an API within `HelloWorld` by writing `useEffect(() => {{ axios.get(`https://api.example.com/data`).then(response => {{ console.log(response.data); }}); }}, []);`. 
        Finally, render the fetched data in the component`s return statement and export the `HelloWorld` component with `export default HelloWorld`. 
        Import and use the `HelloWorld` component in `App.js` by adding `import HelloWorld from `./HelloWorld`;` and including `<HelloWorld />` in the JSX returned by `App`."
        </video_transcript>

        </EXAMPLE INPUT 1>
        <EXAMPLE OUTPUT 1>
        {
            "task": "Create a Hello World application with Axios in React",
            "steps": [
                "Step 1: Set up a new React project using `npx create-react-app hello-world-app`.",
                "Step 2: Navigate to the project directory by running `cd hello-world-app`.",
                "Step 3: Install Axios with `npm install axios`.",
                "Step 4: Create a new file named `HelloWorld.js` in the `src` directory.",
                "Step 5: Import Axios in `HelloWorld.js` by adding `import axios from `axios`;` at the top of the file.",
                "Step 6: Define a React functional component named `HelloWorld` using `const HelloWorld = () => {{}}`.",
                "Step 7: Use the `useEffect` hook to fetch data from an API within the `HelloWorld` component by writing `useEffect(() => {{ axios.get(`https://api.example.com/data`).then(response => {{ console.log(response.data); }}); }}, []);`.",
                "Step 8: Render the fetched data in the component`s return statement by adding appropriate JSX.",
                "Step 9: Export the `HelloWorld` component using `export default HelloWorld;`.",
                "Step 10: Import and use the `HelloWorld` component in `App.js` by adding `import HelloWorld from `./HelloWorld`;` and including `<HelloWorld />` in the JSX returned by `App`."
            ],
            "summary_task": "Create a React component that fetches and displays data using Axios."
        }
        </EXAMPLE OUTPUT 1>

        <video_transcript>
        """+transcript+"""
        </video_transcript>

        Task: """+title

        instructions = self.model.generate_content(prompt)
        instructions = self.fix_json(instructions.text)
        summary_prompt = f"Generate a concise summary of the video transcript. Transcript: {transcript}"
        summary = self.model.generate_content(summary_prompt)
        name_prompt = f"Generate one concise name for the task from the title of the video. Title: {title}"
        name = self.model.generate_content(name_prompt)

        return {"title": title, "instructions": instructions, "summary": summary.text, "name": name.text}

    
    def fix_json(self, json_input: str):
        """
        Fix invalid json.
        """
        output_parser = JsonOutputParser()
        validate_template_string = """
        you are a very helpful JSON validator. Given an invalid JSON object, you will correct the JSON format \
        and return a valid JSON object.

        Here is an invalid JSON object: {json_input}

        Please correct the JSON format and return a valid JSON object.
        """

        validate_prompt_template = PromptTemplate(template=validate_template_string, input_variables=["json_input"])
        chain = validate_prompt_template | self.langchain_model | output_parser
        validate_result = chain.invoke({"json_input": json_input})
        
        # json_result = json.dumps(validate_result)
        # print("json_result: ", json_result)

        # print("validate_result: ", validate_result)
        return validate_result
    