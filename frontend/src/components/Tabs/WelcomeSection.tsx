
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../assets/images/background_home_page_compressed_v2.jpg";
import { styled } from "@mui/system";
import AnchorLink from "react-anchor-link-smooth-scroll";

interface WelcomeSectionProps {
  title: string;
  description: string;
}
const BackgroundImage = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;

  // background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  // height: 210%;
  height: 100vh;
  z-index: -1;
`;

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ title, description }) => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundImage />
    <Box 
      component="section" 
      position="relative" 
      display="flex" 
      justifyContent="left" 
      alignItems="center" 
      width="100%" 
      height="150vh" 
      marginTop={'-5%'}
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
          height: '250vh',
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
          height: '67%',
          bgcolor: '#2a2a2b36'
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
  mt={-35} 
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
  <AnchorLink href="#task-section" style={{ textDecoration: 'none' }}>
  <Box 
    component="img" 
    src="/images/flecha.gif" 
    alt="" 
    mr={55} 
    mt={4} 
    width="50px" 
  />
  </AnchorLink>
  </Box>
    </Box>
    </Box>
  );
};

export default WelcomeSection;
