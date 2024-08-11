import React from 'react';
import WelcomeSection from './WelcomeSection';
import TaskSection from './TaskSection';
import MouseTrail from './welcome/MouseTrail';
import { Box } from '@mui/material';

const GeminiWelcome: React.FC = () => {
  return (
    <Box margin={0} padding={0} position="relative">
      {/* <MouseTrail /> */}
      <WelcomeSection
        title="Welcome to Task Pal!"
        description="Meet Task Pal, your AI-powered sidekick for getting things done. It turns any task into simple, step-by-step instructions, making even the toughest challenges a breeze. From mastering new skills to knocking out your to-do list, Task Pal leverages cutting-edge AI to guide you every step of the way. Get ready to turn 'I can't' into 'All done.'"
      />
      
      <Box
        sx={{
          width: '100%',
          height: '2px', 
          bgcolor: '#9c58c1', 
          position: 'absolute',
          top: '100vh', 
          zIndex: 1,
          borderRadius: '500px 500px 10px 10px',
        }}
      />
      <TaskSection />
    </Box>
  );
};

export default GeminiWelcome;
