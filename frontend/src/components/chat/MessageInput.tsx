
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Paper, TextField, Box, Typography, IconButton, InputAdornment, Select, MenuItem } from "@mui/material";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import "../styles/MessageInput.css"; 

interface MessageInputProps {
  onSendMessage: (message: string | File, inputText?: string) => void;
  lastBotMessage: string;
  inputText: string; 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  setInputText: (text: string) => void;  
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, lastBotMessage, inputText, onChange, setInputText }) => {
  //const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      if (voicesList.length > 0) {
        setSelectedVoice(voicesList[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

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
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setInputText("");

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioStreamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          await handleUpload(audioBlob);
        };

        mediaRecorder.start();
      })
      .catch(error => {
        console.error("Error accessing microphone:", error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
    }
  };

  const handleUpload = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/audio/upload_process`, formData);
      const transcribedText = response.data.transcription;
      setInputText(transcribedText);
      speakText(transcribedText);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setInputText("Error occurred while recording audio");
    }
  };

  const speakText = (text: string) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (event: SelectChangeEvent<string>) => {
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
    <div className="message-input-container">
      <TextField
        fullWidth
        placeholder="Enter a message..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        variant="outlined"
        className="message-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleReadClick} className="icon-button">
                <VolumeUpIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleRecordClick} className="icon-button">
                {isRecording ? <RecordVoiceOverIcon /> : <MicIcon />}
              </IconButton>
              <IconButton {...getRootProps()} className="icon-button">
                <input {...getInputProps()} onChange={handleFileChange} style={{ display: 'none' }} />
                <ImageIcon />
              </IconButton>
              <IconButton onClick={handleSendMessage} className="icon-button">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent', 
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent', 
            },
          },
        }}
      />
      {/* <Box {...getRootProps()} className="dropzone">
        <input {...getInputProps()} onChange={handleFileChange} />
        {preview ? (
          <img src={preview} alt="preview" className="preview-image" />
        ) : (
          <Typography className="dropzone-text">Drag & drop an image here, or click to select one</Typography>
        )}
      </Box>
      <div className="voice-select-container">
        <label htmlFor="voiceSelect" className="voice-select-label">Choose Voice: </label>
        <Select
          id="voiceSelect"
          value={selectedVoice?.name || ""}
          onChange={handleVoiceChange}
          className="voice-select"
        >
          {voices.map((voice, index) => (
            <MenuItem key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </MenuItem>
          ))}
        </Select>
      </div> */}
    </div>
  );
};

export default MessageInput;
