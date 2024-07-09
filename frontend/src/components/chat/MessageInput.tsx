import React, { useState, useCallback } from "react";
import { Paper, TextField, Box, Typography } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import SendButton from "../Buttons/SendButton";

interface MessageInputProps {
  onSendMessage: (message: string | File, inputText?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (file) {
      onSendMessage(file, inputText);
      setFile(null);
      setPreview(null);
      setInputText("");
    } else if (inputText.trim() !== "") {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  return (
    <Paper style={{ display: 'flex', alignItems: 'center', padding: '8px', marginTop: '16px', flexDirection: 'column' }}>
      <TextField
        fullWidth
        placeholder="Enter a message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        variant="outlined"
        style={{ marginBottom: '8px' }}
      />
      <Box {...getRootProps()} border="2px dashed grey" padding="16px" marginBottom="8px" width="100%" textAlign="center">
        <input {...getInputProps()} onChange={handleFileChange} />
        {preview ? (
          <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '150px' }} />
        ) : (
          <Typography>Drag & drop an image here, or click to select one</Typography>
        )}
      </Box>
      <SendButton onClick={handleSendMessage} />
    </Paper>
  );
};

export default MessageInput;
