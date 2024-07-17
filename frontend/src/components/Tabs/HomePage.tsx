import React from 'react';
import WelcomeSection from './WelcomeSection';
import TaskSection from './TaskSection';
import { Box } from '@mui/material';

const GeminiWelcome: React.FC = () => {
  return (
    <Box width="100vw" height="100vh" margin={0} padding={0}>
      <WelcomeSection
        title="Welcome to Google Gemini!"
        description="Discover a vibrant community of creators on Google Gemini! Connect with thousands of like-minded individuals on Discord or the web and unleash your imagination through collaborative storytelling. From vivid worlds to unforgettable characters, bring your short text descriptions to life in new and exciting ways. Join Serendipity today and embark on a journey of endless creativity!"
      />
      <TaskSection />
    </Box>
  );
};

export default GeminiWelcome;
