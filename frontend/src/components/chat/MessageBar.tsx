import React, { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import { startConversation, sendMessage, sendImageMessage } from "../../utils/api";
import CustomAppBar from "../AppBar/CustomAppBar";
import BackButton from "../Buttons/BackButton";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageBarProps {
  selectedTaskFilename: string | null;
  setSelectedTaskFilename: (filename: string | null) => void;
}

const MessageBar: React.FC<MessageBarProps> = ({ selectedTaskFilename, setSelectedTaskFilename }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const initiateConversation = async () => {
      if (!selectedTaskFilename) return;

      setMessages([]);
      setConversationId(null);
      setCurrentStepIndex(0);
      setAllTasksCompleted(false);

      try {
        const response = await startConversation(selectedTaskFilename);
        const { conversation_id, current_step_index, all_steps_completed, messages } = response;
        setConversationId(conversation_id);
        setMessages(messages);
        setCurrentStepIndex(current_step_index);
        setAllTasksCompleted(all_steps_completed);
      } catch (error) {
        console.error("Error starting task:", error);
        setMessages([]);
        setConversationId(null);
        setCurrentStepIndex(0);
        setAllTasksCompleted(false);
      }
    };

    initiateConversation();
  }, [selectedTaskFilename]);

  const handleSendMessage = async (message: string | File, inputText?: string) => {
    if (!selectedTaskFilename || !conversationId) return;

    try {
      let response;
      console.log("Message sent:", message);
      if (typeof message === 'string') {
        console.log("case 1")
        response = await sendMessage(message, conversationId, selectedTaskFilename);
      } else {
        console.log("Sending image with input text:", inputText);
        response = await sendImageMessage(message, inputText || '', conversationId, selectedTaskFilename);
      }

      console.log("Response:", response);

      const { response: botResponse, current_step_index, all_steps_completed } = response;

      setMessages(prevMessages => [
        ...prevMessages,
        { role: "user", content: typeof message === 'string' ? message : URL.createObjectURL(message), type: typeof message === 'string' ? 'text' : 'image' },
        { role: "assistant", content: botResponse }
      ]);
      setCurrentStepIndex(current_step_index);
      setAllTasksCompleted(all_steps_completed);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const lastBotMessage = messages.filter(msg => msg.role === 'assistant').pop()?.content || '';

  return (
    <Container>
      {!allTasksCompleted && <CustomAppBar title={selectedTaskFilename} />}
      <BackButton onClick={() => setSelectedTaskFilename(null)} />
      <MessageContainer messageList={messages} />
      <MessageInput onSendMessage={handleSendMessage} lastBotMessage={lastBotMessage} />
      {!allTasksCompleted && messages[currentStepIndex] && (
        <Box mt={2}>
          <Typography variant="h6">Current Step: {messages[currentStepIndex].content}</Typography>
        </Box>
      )}
      {allTasksCompleted && (
        <Box mt={2}>
          <Typography variant="h6">You have completed all tasks.</Typography>
        </Box>
      )}
    </Container>
  );
};

export default MessageBar;
