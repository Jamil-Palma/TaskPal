import React from "react";
import MessageItem from "./MessageItem";

interface Message {
  role: string;
  content: string;
  type?: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </>
  );
};

export default MessageList;
