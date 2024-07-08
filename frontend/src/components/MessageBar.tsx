import React, { useState, useEffect } from "react";
import { AppBar, Button, TextField, Typography, Box, Toolbar, Container, Paper } from "@mui/material";
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
    <Container>
      {!allTasksCompleted && currentTask && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div">
              {currentTask.task}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Button onClick={() => setSelectedTaskFilename(null)} variant="contained" color="secondary" style={{ marginTop: '16px' }}>
        Back to Task Selection
      </Button>
      <MessageContainer messageList={messages} />
      <Paper style={{ display: 'flex', alignItems: 'center', padding: '8px', marginTop: '16px' }}>
        <TextField
          fullWidth
          placeholder="Enter a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
          variant="outlined"
          style={{ marginRight: '8px' }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Paper>
      {!allTasksCompleted && currentTask && (
        <Box style={{ marginTop: '16px' }}>
          {currentStep && <Typography variant="h6">Current Step: {currentStep}</Typography>}
          <Typography><strong>Summary:</strong> {currentTask.summary_task}</Typography>
        </Box>
      )}
      {allTasksCompleted && (
        <Box style={{ marginTop: '16px' }}>
          <Typography variant="h6">You have completed all tasks.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default MessageBar;
