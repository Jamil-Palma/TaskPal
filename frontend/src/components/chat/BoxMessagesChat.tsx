import React from "react";
import { Box, Paper, Avatar } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import useRenderMessageContent from "./useRenderMessageContent";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface BoxMessagesChatProps {
  messageList: Message[];
}

const BoxMessagesChat: React.FC<BoxMessagesChatProps> = ({ messageList }) => {
  const renderMessageContent = useRenderMessageContent();

  return (
    <Paper sx={{ padding: '16px', marginTop: '16px', height: '60vh', overflow: 'auto', backgroundColor: 'rgba(28, 28, 28, 0.8)', color: '#ffffff', borderRadius: '8px' }}>
      {messageList.map((message, index) => (
        <Box 
          key={index} 
          sx={{ 
            display: 'flex', 
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row', 
            alignItems: 'center', 
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',

            mb: 2,

          }}
        >
          <Avatar sx={{ bgcolor: message.role === 'user' ? 'rgba(255, 241, 115, 0.9)' : 'rgba(174, 139, 255, 0.8)', marginLeft: message.role === 'user' ? 2 : 0, marginRight: message.role === 'user' ? 0 : 2 }}>
            {message.role === 'user' ? <AccountCircleIcon /> : <SmartToyIcon />}
          </Avatar>
          <Box 
            sx={{ 
              border: 1, 
              borderColor: message.role === 'user' ? 'rgba(255, 241, 115, 0.6)' : 'rgba(174, 139, 255, 0.8)', 
              borderRadius: '15px', 
              bgcolor: message.role === 'user' ? 'rgba(255, 241, 115, 0.7)' : 'rgba(174, 139, 255, 0.6)', 
              color: '#ffffff',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              maxWidth: '75%',
              ml: message.role === 'user' ? 'auto' : 0,
              mr: message.role === 'user' ? 0 : 'auto',
              p: 1.5
            }}
          >
            {renderMessageContent(message.content)}
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default BoxMessagesChat;
