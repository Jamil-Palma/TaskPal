
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
  mt={-60} 
>
  {/* Title */}
<Typography 
  variant="h1" 
  mt={4} 
  sx={{
    background: 'linear-gradient(90deg, rgba(123,31,162,1) 0%, rgba(236,64,122,1) 50%, rgba(41,121,255,1) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'left', 
    ml: 12 
  }}
>
  {title}
</Typography>

  {/* Description */}
  <Typography 
    variant="body1" 
    mt={4} 
    sx={{ 
      opacity: 0.8,
      textAlign: 'left',
      ml: 14 
    }}
  >
    {description}
  </Typography>

  {/* Logo Image */}
  <Box 
  component="img" 
  src="/images/upgrade.png" 
  alt="" 
  mr={55} // Ajusta la flecha más a la izquierda
  mt={4} // Agrega margen superior para mover la flecha hacia abajo
  width="80px" // Cambié el ancho a 80px para que sea más pequeña
/>



</Box>

    </Box>
  );
};

export default WelcomeSection;
