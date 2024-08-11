// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AudioRecorder: React.FC = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [transcription, setTranscription] = useState("");
//   const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
//   const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

//   useEffect(() => {
//     const loadVoices = () => {
//       const voicesList = window.speechSynthesis.getVoices();
//       setVoices(voicesList);
//       if (voicesList.length > 0) {
//         setSelectedVoice(voicesList[0]);
//       }
//     };

//     // Load voices when component mounts
//     loadVoices();

//     // Add event listener for voices changed
//     window.speechSynthesis.onvoiceschanged = loadVoices;

//     // Clean up event listener on unmount
//     return () => {
//       window.speechSynthesis.onvoiceschanged = null;
//     };
//   }, []);

//   const handleRecordClick = async () => {
//     setIsRecording(true);
//     setTranscription("");

//     try {
//       const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/audio/audio`);
//       console.log("------ response: ", response.data)
//       const transcribedText = response.data.transcription;
//       console.log(" -------- transcripbend text", transcribedText)
//       //const transcribedText = "Si naciste el 26 de noviembre, eres **Sagitario**. Los Sagitario son conocidos por su optimismo, entusiasmo y amor por la aventura. ¡Espero que tengas un cumpleaños feliz! 😄"
//       setTranscription(transcribedText);
//       speakText(transcribedText);
//     } catch (error) {
//       console.error("Error recording audio:", error);
//       setTranscription("Error occurred while recording audio");
//     } finally {
//       setIsRecording(false);
//     }
//   };

//   const speakText = (text: string) => {
//     if (!selectedVoice) return;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 1; // Velocidad de la voz (0.1 a 10)
//     utterance.pitch = 1; // Tono de la voz (0 a 2)
//     utterance.volume = 1; // Volumen (0 a 1)
//     utterance.voice = selectedVoice; // Voz seleccionada
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedVoiceName = event.target.value;
//     const voice = voices.find(v => v.name === selectedVoiceName);
//     setSelectedVoice(voice || null);
//   };

//   return (
//     <div>
//       <button onClick={handleRecordClick} disabled={isRecording}>
//         {isRecording ? "Recording..." : "Record Audio"}
//       </button>
//       {transcription && (
//         <div>
//           <h3>Transcription:</h3>
//           <p>{transcription}</p>
//         </div>
//       )}
//       <div>
//         <label htmlFor="voiceSelect">Choose Voice: </label>
//         <select id="voiceSelect" onChange={handleVoiceChange} value={selectedVoice?.name}>
//           {voices.map((voice, index) => (
//             <option key={index} value={voice.name}>
//               {voice.name} ({voice.lang})
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default AudioRecorder;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null); // Añadido

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

  const handleRecordClick = async () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscription("");

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioStreamRef.current = stream; // Guardar la referencia del stream
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

      // Detener el stream de audio
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
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload/`, formData);
      const transcribedText = response.data.transcription;
      setTranscription(transcribedText);
      speakText(transcribedText);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setTranscription("Error occurred while uploading audio");
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

  return (
    <div>
      <button onClick={handleRecordClick} disabled={isRecording}>
        {isRecording ? "Stop Recording" : "Record Audio"}
      </button>
      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
      <div>
        <label htmlFor="voiceSelect">Choose Voice: </label>
        <select id="voiceSelect" onChange={handleVoiceChange} value={selectedVoice?.name}>
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AudioRecorder;

