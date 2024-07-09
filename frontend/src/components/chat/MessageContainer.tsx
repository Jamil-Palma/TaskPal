import React from "react";
import { List, Paper } from "@mui/material";
import MessageList from "./MessageList";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageContainerProps {
  messageList: Message[];
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messageList }) => {
  return (
    <Paper style={{ padding: '16px', marginTop: '16px', maxHeight: '60vh', overflow: 'auto' }}>
      <List>
        <MessageList messages={messageList} />
      </List>
    </Paper>
  );
};

export default MessageContainer;
