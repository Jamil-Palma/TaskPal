import React, { useState, useCallback, useEffect } from "react";
import { Paper, TextField, Box, Typography, Button } from "@mui/material";
import { useDropzone } from 'react-dropzone';
import SendButton from "../Buttons/SendButton";
import axios from "axios";

interface MessageInputProps {
  onSendMessage: (message: string | File, inputText?: string) => void;
  lastBotMessage: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, lastBotMessage }) => {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      if (voicesList.length > 0) {
        setSelectedVoice(voicesList[0]);
      }
    };

    // Load voices when component mounts
    loadVoices();

    // Add event listener for voices changed
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Clean up event listener on unmount
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

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

  const handleRecordClick = async () => {
    setIsRecording(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/audio/audio");
      console.log("Response: ", response.data)
      const transcribedText = response.data.transcription;
      setInputText(transcribedText);
    } catch (error) {
      console.error("Error recording audio:", error);
      setInputText("Error occurred while recording audio");
    } finally {
      setIsRecording(false);
    }
  };

  const speakText = (text: string) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Velocidad de la voz (0.1 a 10)
    utterance.pitch = 1; // Tono de la voz (0 a 2)
    utterance.volume = 1; // Volumen (0 a 1)
    utterance.voice = selectedVoice; // Voz seleccionada
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoiceName = event.target.value;
    const voice = voices.find(v => v.name === selectedVoiceName);
    setSelectedVoice(voice || null);
  };

  const handleReadClick = () => {
    if (lastBotMessage) {
      speakText(lastBotMessage);
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
      <Button onClick={handleRecordClick} disabled={isRecording} style={{ marginTop: '8px' }}>
        {isRecording ? "Recording..." : "Record Audio"}
      </Button>
      <Button onClick={handleReadClick} style={{ marginTop: '8px' }}>
        Read Last Bot Message
      </Button>
      <div style={{ marginTop: '8px' }}>
        <label htmlFor="voiceSelect">Choose Voice: </label>
        <select id="voiceSelect" onChange={handleVoiceChange} value={selectedVoice?.name}>
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
    </Paper>
  );
};

export default MessageInput;
