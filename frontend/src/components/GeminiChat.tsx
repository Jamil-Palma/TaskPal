import React, { useState, KeyboardEvent } from "react";
import axios from "axios";

interface Message {
  text: string;
  user: boolean;
}

const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const userMessage: Message = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/question`, {
        input_text: userInput,
      });
      const botMessage: Message = { text: response.data.response, user: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setLoading(false);
      setUserInput("");
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking && currentUtterance) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.user) {
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setCurrentUtterance(utterance);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              background: msg.user ? "#e1f5fe" : "#ffebee",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message"
        onChange={(e) => setUserInput(e.target.value)}
        value={userInput}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage} disabled={loading}>
        Send
      </button>
      <button onClick={toggleSpeech}>{isSpeaking ? "Stop" : "Speak"}</button>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default GeminiChat;
