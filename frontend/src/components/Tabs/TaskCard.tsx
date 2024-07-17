import React from 'react';
import { Box, Card, Typography, Button, CardMedia } from '@mui/material';

interface TaskCardProps {
  title: string;
  description: string;
  imageSrc: string;
  titleBackgroundSrc: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, imageSrc, titleBackgroundSrc }) => {
  return (
    <Card sx={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
          justifyContent: 'space-between',
          color: 'white',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          <Box
            component="img"
            src={titleBackgroundSrc}
            sx={{
              position: 'absolute',
              top: '-10px',  // Ajusta esto según sea necesario
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: 'auto',
            }}
          />
          <Typography variant="h5" component="div" sx={{ position: 'absolute', top: '15px', left: '50%', transform: 'translate(-50%, 0)', padding: '0 10px', borderRadius: '5px' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: '60px' }}>
          <Box sx={{ background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '10px', padding: '10px', textAlign: 'center', maxWidth: '90%' }}>
            <Typography variant="body2">
              {description}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', paddingBottom: 2 }}>
          <Button variant="contained" color="primary" sx={{ width: '80%' }}>
            Select Task
          </Button>
          <Button variant="outlined" color="primary" sx={{ width: '80%' }}>
            Explore Now
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default TaskCard;
