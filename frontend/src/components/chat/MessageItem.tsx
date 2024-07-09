import React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar>
          {message.role === "user" ? <PersonIcon /> : <SmartToyIcon />}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message.role}
        secondary={
          message.type === 'image' ? (
            <img src={message.content} alt="Uploaded content" style={{ maxWidth: '100%' }} />
          ) : (
            message.content
          )
        }
      />
    </ListItem>
  );
};

export default MessageItem;
