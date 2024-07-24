import React, { useState }  from 'react';
import { Box, Card, Typography, Button, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import exploreNow from '../../assets/images/Button.png';
import ExploreIcon from '@mui/icons-material/PlayCircle';

interface TaskCardProps {
  title: string;
  description: string;
  imageSrc: string;
  titleBackgroundSrc: string;
  url: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, imageSrc, titleBackgroundSrc, url }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleExploreNowClick = () => {
    navigate(url);
  };

  return (
    <Card
      sx={{ 
        position: 'relative', 
        borderRadius: '20px', 
        overflow: 'visible', 
        height: '400px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          '& .overlay': {
            bottom: '-5%',
            opacity: 1,
          },
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardMedia
        component="img"
        image={imageSrc}
        title={title}
        sx={{ height: '100%', width: '100%' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          color: 'white',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', textAlign: 'center', paddingTop: '20px' }}>
          <Box
            component="img"
            src={titleBackgroundSrc}
            sx={{
              position: 'absolute',
              top: '-10px',  
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: '80px',
              zIndex: 1,
              // border: '2px solid #FFF',
              // borderRadius: '10px',
            }}
          />
          <Typography variant="h5" component="div" sx={{ position: 'relative', top: '-5px', zIndex: 2 }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          bottom: '-50%', 
          left: '5%',
          width: '90%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          background: '#313a5bb2',
          backdropFilter: 'blur(10px)', 
          transition: 'bottom 0.3s ease-in-out, opacity 0.3s ease-in-out',
          padding: '20px',
          borderRadius: '20px 20px 20px 20px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.8)',
          zIndex: 2,
          opacity: 0,  
        }}
      >
        <Typography variant="body2" sx={{ textAlign: 'center' , paddingTop: 3 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', paddingTop: 2 }}>
        <Button 
            className="glow-on-hover"
            sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
              boxShadow: 'none',
              border: 'none',
              alignSelf: 'flex-start',
              marginLeft: '10px',
              color: 'white'
            }}
          >
            Select Task
          </Button>
          <Button
    className="explorenow"
    sx={{
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'scale(1.1)',
      },
      boxShadow: 'none',
      border: 'none',
      alignSelf: 'flex-start',
      marginLeft: '10px',
      color: 'white'
    }}
    startIcon={<ExploreIcon className="icon" />} 
    onClick={handleExploreNowClick}
  >
    Explore Now
  </Button> 
        </Box>
      </Box>
    </Card>
  );
};

export default TaskCard;


