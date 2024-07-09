import React, { useState, useEffect } from "react";
import { AppBar, Button, TextField, Typography, Box, Toolbar, Container, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import MessageContainer from "./MessageContainer";

interface Message {
  role: string;
  content: string;
}

interface MessageBarProps {
  selectedTaskFilename: string | null;
  setSelectedTaskFilename: (filename: string | null) => void;
}

const MessageBar: React.FC<MessageBarProps> = ({ selectedTaskFilename, setSelectedTaskFilename }) => {
  const [inputText, setInputText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  useEffect(() => {
    const startConversation = async () => {
      if (!selectedTaskFilename) return;

      setMessages([]);
      setConversationId(null);
      setCurrentStepIndex(0);
      setAllTasksCompleted(false);

      try {
        const startResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/text/start-conversation`,
          {
            task: selectedTaskFilename
          }
        );

        const {
          response: botResponse,
          conversation_id,
          current_step_index,
          all_steps_completed,
          messages
        } = startResponse.data;
        console.log('Start response:', startResponse.data);
        setConversationId(conversation_id);
        setMessages(messages);
        setCurrentStepIndex(current_step_index);
        setAllTasksCompleted(all_steps_completed);
      } catch (error) {
        console.error("Error starting task:", error);
      }
    };

    startConversation();
  }, [selectedTaskFilename]);

  const sendMessage = async () => {
    if (inputText.trim() === "" || !selectedTaskFilename || !conversationId) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/ask`, {
        input_text: inputText,
        conversation_id: conversationId,
      });

      const {
        response: botResponse,
        current_step_index,
        all_steps_completed,
      } = response.data;
      console.log('Query response:', response.data);
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

  const currentStep = messages[currentStepIndex] ? messages[currentStepIndex].content : null;

  return (
    <Container>
      {!allTasksCompleted && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div">
              {selectedTaskFilename}
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
      {!allTasksCompleted && currentStep && (
        <Box style={{ marginTop: '16px' }}>
          <Typography variant="h6">Current Step: {currentStep}</Typography>
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
