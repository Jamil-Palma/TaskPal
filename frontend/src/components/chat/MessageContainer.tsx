import React from "react";
import { Paper } from "@mui/material";
import BoxMessagesChat from "./BoxMessagesChat";

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
      <BoxMessagesChat messageList={messageList} />
  );
};

export default MessageContainer;
