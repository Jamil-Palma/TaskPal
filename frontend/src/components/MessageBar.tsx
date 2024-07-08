import React, { useState, useEffect } from "react";
import { AppBar, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import MessageContainer from "./MessageContainer";

interface MessageBarProps {
  selectedTaskFilename: string | null;
  setSelectedTaskFilename: (filename: string | null) => void;
}

const MessageBar: React.FC<MessageBarProps> = ({ selectedTaskFilename, setSelectedTaskFilename }) => {
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  useEffect(() => {
    const selectTask = async () => {
      if (!selectedTaskFilename) return;

      setMessages([]);
      setConversationId(null);
      setCurrentStepIndex(0);
      setAllTasksCompleted(false);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/task_by_filename/${selectedTaskFilename}`
        );
        const taskDetails = response.data;
        setCurrentTask(taskDetails);

        const startResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/initialize_task`,
          {
            input_text: "",
            filename: selectedTaskFilename,
          }
        );

        const {
          response: botResponse,
          conversation_id,
          current_step_index,
        } = startResponse.data;
        setConversationId(conversation_id);
        setMessages([{ role: "assistant", content: botResponse }]);
        setCurrentStepIndex(current_step_index);
      } catch (error) {
        console.error("Error starting task:", error);
      }
    };

    selectTask();
  }, [selectedTaskFilename]);

  const sendMessage = async () => {
    if (inputText.trim() === "" || !selectedTaskFilename || !conversationId) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/query`, {
        input_text: inputText,
        conversation_id: conversationId,
        filename: selectedTaskFilename,
      });

      const {
        response: botResponse,
        current_step_index,
        all_steps_completed,
      } = response.data;
      setMessages([
        ...messages,
        { role: "user", content: inputText },
        { role: "assistant", content: botResponse },
      ]);
      setCurrentStepIndex(current_step_index);

      if (all_steps_completed) {
        setAllTasksCompleted(true);
      }

      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const currentStep =
    currentTask && currentTask.steps
      ? currentTask.steps[currentStepIndex]
      : null;

  return (
    <div>
      {!allTasksCompleted && currentTask && (
        <AppBar position="static">
          <Typography variant="h3" component="div">
            {currentTask.task}
          </Typography>
        </AppBar>
      )}
      <Button onClick={() => setSelectedTaskFilename(null)}>
        Back to Task Selection
      </Button>
      <MessageContainer messageList={messages} />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <TextField
          fullWidth
          placeholder="Enter a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <Button
          onClick={sendMessage}
          style={{ padding: "10px" }}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </div>
      {!allTasksCompleted && currentTask && (
        <div>
          {currentStep && <h2>Current Step: {currentStep}</h2>}
          <div>
            <strong>Summary:</strong> {currentTask.summary_task}
          </div>
        </div>
      )}
      {allTasksCompleted && (
        <div>
          <h2>You have completed all tasks.</h2>
        </div>
      )}
    </div>
  );
};

export default MessageBar;
