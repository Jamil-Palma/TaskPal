import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import arrow from '../../assets/images/upgrade.png';

interface TaskData {
  title: string;
  description: string;
  imageSrc: string;
  titleBackgroundSrc: string;
  url: string;
}

const taskData: TaskData[] = [
  {
    title: "Predefined Tasks",
    description: "Data technology futuristic illustration. A wave of bright particles. Technological 3D landscape. Big data visualization. Network of dots connected by lines. Abstract digital background. 3d rendering 8k, hyperrealistic, dark blue to baby pink, ultra-realistic, high resolution, very detailed, very sharpen",
    imageSrc: "/images/Predefiend_task_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/predefined-tasks"
  },
  {
    title: "URL Tasks",
    description: "Data technology futuristic illustration. A wave of bright particles. Technological 3D landscape. Big data visualization. Network of dots connected by lines. Abstract digital background. 3d rendering 8k, hyperrealistic, dark blue to baby pink, ultra-realistic, high resolution, very detailed, very sharpen",
    imageSrc: "/images/URL_Task_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/url-task"
  },
  {
    title: "Chat",
    description: "Data technology futuristic illustration. A wave of bright particles. Technological 3D landscape. Big data visualization. Network of dots connected by lines. Abstract digital background. 3d rendering 8k, hyperrealistic, dark blue to baby pink, ultra-realistic, high resolution, very detailed, very sharpen",
    imageSrc: "/images/chat_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/empty-chat"
  }
];

const TaskSection: React.FC = () => {
  return (
    <Box component="section" py={5} px={2} maxWidth="1200px" mx="auto" mt={-50} sx={{ position: 'relative', zIndex: 1 }}>
      <Box
        component="img"
        src={arrow} 
        alt="arrow" 
        style={{ display: 'block', margin: '0 auto' }}
      />
      <Typography variant="h4" component="h2" textAlign="center" mb={4}>
        Select a task to start
      </Typography>
      <Grid container spacing={4}>
        {taskData.map((task, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TaskCard
              title={task.title}
              description={task.description}
              imageSrc={task.imageSrc}
              titleBackgroundSrc={task.titleBackgroundSrc}
              url={task.url}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskSection;
