import React from "react";
import "../components/styles/messagecontainer.css";
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
    <div className="chat-container">
      {messageList.map((message, index) => (
        <div key={index} className={`msg-container ${message.role === "user" ? "message-right" : "message-left"}`}>
          <div className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
            <div className="role">
              {message.role === "user" ? <PersonIcon /> : <SmartToyIcon />} {message.role}
            </div>
            <div className="content">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
