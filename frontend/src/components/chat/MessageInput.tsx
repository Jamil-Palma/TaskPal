import React, { useState } from "react";
import { Paper, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SendButton from "../Buttons/SendButton";

interface MessageInputProps {
  onSendMessage: (message: string | File) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (inputText.trim() !== "") {
      onSendMessage(inputText);
      setInputText("");
    } else if (file) {
      onSendMessage(file);
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Paper style={{ display: 'flex', alignItems: 'center', padding: '8px', marginTop: '16px' }}>
      <TextField
        fullWidth
        placeholder="Enter a message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        variant="outlined"
        style={{ marginRight: '8px' }}
      />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-file"
      />
      <label htmlFor="upload-file">
        <Button
          component="span"
          variant="contained"
          color="primary"
          style={{ marginRight: '8px' }}
        >
          Upload
        </Button>
      </label>
      <SendButton onClick={handleSendMessage} />
    </Paper>
  );
};

export default MessageInput;
