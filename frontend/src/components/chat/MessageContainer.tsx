import React from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

interface Message {
  role: string;
  content: string;
}

interface MessageContainerProps {
  messageList: Message[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messageList }) => {
  return (
    <Paper style={{ padding: '16px', marginTop: '16px', maxHeight: '60vh', overflow: 'auto' }}>
      <List>
        {messageList.map((message, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>
                {message.role === "user" ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={message.role}
              secondary={message.content}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MessageContainer;
