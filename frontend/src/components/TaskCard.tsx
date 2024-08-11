import React, { useState, MouseEvent } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  IconButton,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import ButtonList1 from '../assets/images/Button_List_1.png';
import ButtonList2 from '../assets/images/Button_List_2.png';
import ButtonList3 from '../assets/images/Button_List_3.png';

interface TaskContent {
  task: string;
  summary_task: string;
}

interface Task {
  title: string;
  content: TaskContent;
  file_name: string;
}

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  onExpandClick: () => void;
  onSelectTask: (filename: string) => void;
}

interface ExpandMoreIconButtonProps {
  expand: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  "aria-expanded": boolean;
  "aria-label": string;
  children: React.ReactNode;
}

const ExpandMoreIconButton = styled((props: ExpandMoreIconButtonProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledButtonContainer = styled(Box)({
  background: 'linear-gradient(90deg, rgba(225, 179, 209, 0.3) 0%, rgba(98, 61, 147, 0.3) 100%)',
  borderRadius: '15px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'background-color 0.3s, transform 0.3s',
  width: '100%',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Añadido para bordes difuminados
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.05)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Sombra al hacer hover
  },
  '&:active': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .icon': {
    alignSelf: 'flex-start',
    marginBottom: '10px',
  },
  '& .select-task-text': {
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '10px',
  },
  '& .text-container': {
    display: 'flex',
    flexDirection: 'column',
  },
  '& .details-text': {
    marginTop: '10px',
  }
});

const TaskCard: React.FC<TaskCardProps> = ({ task, expanded, onExpandClick, onSelectTask }) => {
  const [buttonImage, setButtonImage] = useState(ButtonList1);

  const handleExpandClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onExpandClick();
  };

  const handleSelectTask = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onSelectTask(task?.file_name);
  };

  React.useEffect(() => {
    if (expanded) {
      setButtonImage(ButtonList3);
    } else {
      setButtonImage(ButtonList1);
    }
  }, [expanded]);

  return (
    <Card variant="outlined" style={{ backgroundColor: 'transparent', borderRadius: '20px', padding: '20px', margin: '10px 0', boxShadow: 'none', border: 'none' }}>
      <CardContent>
        <StyledButtonContainer
          onClick={handleExpandClick}
          onMouseEnter={() => !expanded && setButtonImage(ButtonList2)}
          onMouseLeave={() => !expanded && setButtonImage(ButtonList1)}
        >
          <img src={buttonImage} alt="Button icon" className="icon" />
          <div className="text-container">
            <Typography variant="h6" component="h3">
              {task?.content?.task}
            </Typography>
            <span className="select-task-text" onClick={handleSelectTask}>
              Select Task
            </span>
            {expanded && (
              <Typography variant="body2" component="p" className="details-text">
                {task?.content?.summary_task}
              </Typography>
            )}
          </div>
        </StyledButtonContainer>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMoreIconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          expand={expanded}
        >
          <ExpandMore />
        </ExpandMoreIconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
