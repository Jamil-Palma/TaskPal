
import React from 'react';
import { Box, Typography } from '@mui/material';

interface WelcomeSectionProps {
  title: string;
  description: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ title, description }) => {
  return (
    <Box 
      component="section" 
      position="relative" 
      display="flex" 
      justifyContent="left" 
      alignItems="center" 
      width="100vw" 
      height="150vh" 
      margin={0} 
      padding={0} 
      overflow="hidden"
    >
      {/* Background Image */}
      <Box 
        component="img" 
        src="/images/background_home_page_compressed_v2.jpg" 
        alt="" 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
        }}
      />
      {/* Overlay Effect */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.5)'
        }} 
      />
      {/* Text Container */}
      <Box 
        position="relative" 
        zIndex={1} 
        textAlign="center" 
        color="white" 
        px={2} 
        maxWidth="800px"
      >
        {/* Logo Image */}
        <Box 
          component="img" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2c7c8f93ae23b715f31b08846de1ce531a824852afa345c6d2b5e6c7f7823d8?apiKey=85ed67fc5e9240cebf026c7e934f100c&" 
          alt="" 
          mx="auto"
          width="174px"
        />
        {/* Title */}
        <Typography 
          variant="h1" 
          mt={4} 
          sx={{
            background: 'linear-gradient(90deg, rgba(123,31,162,1) 0%, rgba(236,64,122,1) 50%, rgba(41,121,255,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {title}
        </Typography>
        {/* Description */}
        <Typography 
          variant="body1" 
          mt={4} 
          sx={{ opacity: 0.8 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeSection;
