import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import TaskCard from './TaskCard';
import arrow from '../../../public/images/flecha.gif';

interface TaskData {
  title: string;
  description: string;
  imageSrc: string;
  titleBackgroundSrc: string;
  url: string;
}

const taskData: TaskData[] = [
  /*{
    title: "Predefined Tasks",
    description: "Select through a list of predefined tasks",
    imageSrc: "/images/Predefiend_task_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/predefined-tasks"
  },*/
  {
    title: "URL Tasks",
    description: "Generate tasks from videos using URLs",
    imageSrc: "/images/URL_Task_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/url-task"
  },
  {
    title: "Chat",
    description: "Continue your tasks by chatting with Gemini AI",
    imageSrc: "/images/chat_compressed.jpg",
    titleBackgroundSrc: "/images/title_3.png",
    url: "/empty-chat"
  }
];

const TaskSection: React.FC = () => {
  return (
    <Box id="task-section" component="section" py={5} px={2} maxWidth="1200px" mx="auto" mt={-50} sx={{ position: 'relative', zIndex: 1 }}>
      
      <Box 
  component="img" 
  src="/images/flecha.gif" 
  alt="" 
  ml={70} 
  mt={10} 
  width="50px" 
/>
      <Typography variant="h2" component="h2" textAlign="center" mb={4} sx={{ fontWeight: 'bold', background: 'linear-gradient(to right, #CC51D6, #5A68E8, #E1B1FF)', backgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 4px 4px #FF3CD45E)' }}>
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
