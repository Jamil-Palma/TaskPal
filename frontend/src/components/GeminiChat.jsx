import React, { useState } from "react";
import axios from "axios";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages([...messages, userMessage]);

    try {
      if (userInput.includes(".mp3")) {
        const response = await axios.post(
          "http://localhost:8000/audio_url_to_text",
          {
            input_text: userInput,
          }
        );
        const botMessage = { text: response.data.response, user: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
        setUserInput("");

        if (botMessage.text && !isSpeaking) {
          const utterance = new SpeechSynthesisUtterance(botMessage.text);
          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
        }
      } else {
        const response = await axios.post("http://localhost:8000/question", {
          input_text: userInput,
        });
        const botMessage = { text: response.data.response, user: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
        setUserInput("");

        if (botMessage.text && !isSpeaking) {
          const utterance = new SpeechSynthesisUtterance(botMessage.text);
          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
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
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default GeminiChat;
