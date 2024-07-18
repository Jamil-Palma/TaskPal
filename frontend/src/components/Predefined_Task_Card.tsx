import React from 'react';
import { Box, Card, Typography, Button, CardMedia } from '@mui/material';
import taskBackground from '../assets/buttons/task_default.png'

interface PredefinedTaskCardProps {
}



const PredefinedTaskCard: React.FC<PredefinedTaskCardProps> = () => {
    return (
    <Card sx={{background: 'rgba(0, 0, 0, 0.2)', width: '25vw', height: 'auto'}}>
        <CardMedia
            component="img"
            src={taskBackground}
        />

    </Card>
    );
};

export default PredefinedTaskCard;