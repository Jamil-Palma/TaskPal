import React from 'react';
import WelcomeSection from './WelcomeSection';
import TaskSection from './TaskSection';
import MouseTrail from './welcome/MouseTrail';
import { Box } from '@mui/material';

const GeminiWelcome: React.FC = () => {
  return (
    <Box width="100vw" height="auto" margin={0} padding={0} position="relative">
      {/* <MouseTrail /> */}
      <WelcomeSection
        title="Welcome to Google Gemini!"
        description="Discover a vibrant community of creators on Google Gemini! Connect with thousands of like-minded individuals on Discord or the web and unleash your imagination through collaborative storytelling. From vivid worlds to unforgettable characters, bring your short text descriptions to life in new and exciting ways. Join Serendipity today and embark on a journey of endless creativity!"
      />
      
      <Box
        sx={{
          width: '100%',
          height: '3px', 
          bgcolor: 'rgba(211, 211, 211, 0.5)', 
          position: 'absolute',
          top: '105vh', 
          zIndex: 1,
          borderRadius: '500px 500px 10px 10px',
        }}
      />
      <TaskSection />
    </Box>
  );
};

export default GeminiWelcome;
