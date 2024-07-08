import React, { useState } from "react";
import axios from "axios";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");

  const handleRecordClick = async () => {
    setIsRecording(true);
    setTranscription("");

    try {
      const response = await axios.post("http://localhost:8000/audio/audio");
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error recording audio:", error);
      setTranscription("Error occurred while recording audio");
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button onClick={handleRecordClick} disabled={isRecording}>
        {isRecording ? "Recording..." : "Record Audio"}
      </button>
      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
