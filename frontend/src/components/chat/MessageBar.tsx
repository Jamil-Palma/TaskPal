import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { Container, Box, Typography, Button } from "@mui/material";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import {
  startConversation,
  sendMessage,
  sendImageMessage,
  getConversation,
} from '../../utils/api';
import CustomAppBar from '../AppBar/CustomAppBar';
import ConversationHistory from './ConversationHistory';
import MouseTrail from '../Tabs/welcome/MouseTrail';
import backgroundImage from '../../assets/images/Background_for_other_pages.jpg';
import { styled } from '@mui/system';
import '../styles/MessageBar.css';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageBarProps {
  selectedTaskFilename: string | null;
  setSelectedTaskFilename: (filename: string | null) => void;
}

const BackgroundImage = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const MessageBar: React.FC<MessageBarProps> = ({
  selectedTaskFilename,
  setSelectedTaskFilename,
}) => {
  console.log('==== ingress in message bar : ', selectedTaskFilename);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [filePaht, setFilePath] = useState('');
  const [historyBoxWidth, setHistoryBoxWidth] = useState(window.innerWidth);

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md')
  );

  useEffect(() => {
    const handleResize = () => {
      setHistoryBoxWidth(window.innerWidth - 50);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedTaskFilename) {
      const initiateConversation = async () => {
        setMessages([]);
        setConversationId(null);
        setCurrentStepIndex(0);
        setAllTasksCompleted(false);

        try {
          const response = await startConversation(selectedTaskFilename);
          console.log('   start video conversations is : ', response);
          const {
            conversation_id,
            current_step_index,
            all_steps_completed,
            messages,
          } = response;
          console.log('conversation; id is : ', conversation_id);
          setConversationId(conversation_id);
          setMessages(messages);
          setCurrentStepIndex(current_step_index);
          setAllTasksCompleted(all_steps_completed);
          setFilePath(selectedTaskFilename);
        } catch (error) {
          console.error('Error starting task:', error);
          setMessages([]);
          setConversationId(null);
          setCurrentStepIndex(0);
          setAllTasksCompleted(false);
        }
      };

      initiateConversation();
    }
  }, [selectedTaskFilename]);

  const handleSendMessage = async (
    message: string | File,
    inputText?: string
  ) => {
    console.log('   -+-+ handleSendMessage conversation id:', conversationId);
    if (!conversationId) return;

    try {
      let response;
      if (typeof message === 'string') {
        response = await sendMessage(
          message,
          conversationId,
          filePaht || undefined
        );
      } else {
        response = await sendImageMessage(
          message,
          inputText || '',
          conversationId,
          filePaht || undefined
        );
      }

      const {
        response: botResponse,
        current_step_index,
        all_steps_completed,
      } = response;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'user',
          content:
            typeof message === 'string'
              ? message
              : URL.createObjectURL(message),
          type: typeof message === 'string' ? 'text' : 'image',
        },
        { role: 'assistant', content: botResponse },
      ]);
      setCurrentStepIndex(current_step_index);
      setAllTasksCompleted(all_steps_completed);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    try {
      const conversation = await getConversation(conversationId);
      console.log('conversation is : ', conversation);
      setMessages(conversation.messages);
      setConversationId(conversationId);
      setCurrentStepIndex(conversation.current_step_index);
      setAllTasksCompleted(conversation.all_steps_completed);
      setFilePath(conversation.file_path);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const toggleHistoryVisibility = () => {
    setShowHistory((prev) => !prev);
  };

  const lastBotMessage =
    messages.filter((msg) => msg.role === 'assistant').pop()?.content || '';

  return (
    <Container>
      <Button sx={{ color: 'white' }} onClick={toggleHistoryVisibility}>
        <ViewSidebarIcon />
      </Button>
      <BackgroundImage />
      {/* <Button onClick={() => setShowHistory(!showHistory)} className="toggle-history-button">
        {showHistory ? 'Hide History' : 'Show History'}
      </Button> */}
      <Box
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        mt={2}
      >
        {showHistory && (
          <Box
            className="history-box"
            sx={{
              width: `${historyBoxWidth}px`,
              transition: 'width 0.3s',
              maxWidth: isSmallScreen ? '90%' : '30%',
            }}
          >
            {showHistory && (
              <ConversationHistory
                onSelectConversation={handleSelectConversation}
              />
            )}
          </Box>
        )}
        <Box
          className={`input-and-chat ${
            showHistory ? 'with-history' : 'without-history'
          }`}
        >
          <MessageInput
            onSendMessage={handleSendMessage}
            lastBotMessage={lastBotMessage}
          />
            {/* <MouseTrail /> */}
            {/* {!selectedTaskFilename && !allTasksCompleted && <CustomAppBar title="Chat" />}
            {selectedTaskFilename && !allTasksCompleted && <CustomAppBar title={selectedTaskFilename} />} */}
            <MessageContainer messageList={messages} />
            <Box className="chat-box">
            {!allTasksCompleted && messages[currentStepIndex] && (
              <Box mt={2}>
                <Typography variant="h6" className="current-step">
                  Current Step: {messages[currentStepIndex].content}
                </Typography>
              </Box>
            )}
            {allTasksCompleted && (
              <Box mt={2}>
                <Typography variant="h6" className="all-tasks-completed">
                  You have completed all tasks.
                </Typography>
              </Box>
            )}
            <MouseTrail />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MessageBar;
