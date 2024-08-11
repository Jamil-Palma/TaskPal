import React, { useState, useEffect } from "react";
import { CircularProgress, useMediaQuery } from "@mui/material";
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
import axiosInstance from "../../axiosConfig";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageBarProps {
  selectedTaskFilename: string | null;
  setSelectedTaskFilename: (filename: string | null) => void;
  goToChat: (filename: string) => void;
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
  goToChat,
}) => {
  console.log('==== ingress in message bar : ', selectedTaskFilename);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const [filePaht, setFilePath] = useState('');
  const [historyBoxWidth, setHistoryBoxWidth] = useState(window.innerWidth);

  const [inputValue, setInputValue] = useState('');


  /* start section */
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getUrlType = (url: string): string => {
    const videoPlatforms = ["youtube.com", "vimeo.com"];

    try {
      const urlObj = new URL(url);
      if (
        videoPlatforms.some((platform) => urlObj.hostname.includes(platform))
      ) {
        return "video";
      }
      return "page";
    } catch (error) {
      return "unknown";
    }
  };

  const handleGenerateSteps = async (urlInput: string) => {
    setError(null);
    setIsLoading(true);

    let endpoint = "";
    let input = "";
    if (isUrl(urlInput)) {
      const urlType = getUrlType(urlInput);
      if (urlType === "unknown") {
        setError("Invalid URL. Please enter a valid URL.");
        setIsLoading(false);
        return;
      }

      if (urlType === "video") {
        endpoint = "/video/video-instructions";
      } else {
        endpoint = "/text/scraping";
      }
      input = "input_text";
    } else {
      endpoint = "/text/generate-steps";
      input = "task";
    }

    try {
      console.log("URL: ", input, " - ", urlInput);
      const response = await axiosInstance.post(endpoint, { [input]: urlInput });
      console.log("RESPONSE VIDEO: ", response.data);
      const filePath = response.data.file_path;
      let cleanedFilePath = filePath.slice(10);

      cleanedFilePath = cleanedFilePath.replace(/\\/g, "");
      console.log("data is : ", cleanedFilePath);
      goToChat(cleanedFilePath);
    } catch (err) {
      setError("Failed to generate steps. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  /*end section */
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
    if (!conversationId) {
      console.log("my message is: " , message)
      console.log("my inputText is: " , inputText)
      handleGenerateSteps(message as string)
      return;
    }

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
  const handleQuickResponse = (message: string) => {
    handleSendMessage(message);
  };
        {/*!allTasksCompleted && messages[currentStepIndex] && (
              <Box mt={2}>
                <Typography variant="h6" className="current-step">
                  Current Step: {messages[currentStepIndex].content}
                </Typography>
              </Box>
            )*/}

            
            return (
              <Container>
                <Button sx={{ color: 'white' }} onClick={toggleHistoryVisibility}>
                  <ViewSidebarIcon />
                </Button>
                <BackgroundImage />
                {/* Indicador de carga */}
                {isLoading && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                    zIndex={9999}
                    position="fixed"
                    top={0}
                    left={0}
                    width="100%"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                  >
                    <CircularProgress />
                  </Box>
                )}
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
                    sx={{
                      flex: 1, // Permite que el contenedor ocupe más espacio
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Cuadro superior que contiene los mensajes */}
                    {conversationId && <Box
                      sx={{
                        flex: 2, // Este cuadro ocupa más espacio
                        overflowY: 'auto', // Para que los mensajes puedan desplazarse si son muchos
                      }}
                    >
                      <MessageContainer messageList={messages} />
                    </Box>}
                    
                    {/* Cuadro inferior que contiene el input y los botones */}
                    <Box
                      sx={{
                        flex: 1, // Este cuadro ocupa menos espacio
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Box sx={{ marginBottom: '16px' }}>
                        {!conversationId && "Don't have any tasks? Create a new task now!"}
                        <MessageInput
                          onSendMessage={handleSendMessage}
                          lastBotMessage={lastBotMessage}

                          inputText={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          setInputText={setInputValue} 
                        />
                      </Box>
                      {allTasksCompleted && (
                        <Box mt={2}>
                          <Typography variant="h6" className="all-tasks-completed">
                            You have completed all tasks.
                          </Typography>
                        </Box>
                      )}
            
                      <Box
                        mt={2}
                        display="flex"
                        justifyContent="center"
                        gap={2}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: '#9c27b0',
                            '&:hover': {
                              bgcolor: '#7b1fa2',
                            },
                            color: 'white',
                          }}
                          onClick={() => handleQuickResponse("Ok")}
                        >
                          Step Completed
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: '#ab47bc',
                            '&:hover': {
                              bgcolor: '#8e24aa',
                            },
                            color: 'white',
                          }}
                          onClick={() => setInputValue("I need help because   ")} 
                        >
                          I Need Help with This Step
                        </Button>

                      </Box>
            
                      <MouseTrail />
                    </Box>
                  </Box>
                </Box>
              </Container>
            );
            
            
            
};

export default MessageBar;
