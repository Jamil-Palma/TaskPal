import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  Button,
  IconButton,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface Task {
  task: string;
  summary_task: string;
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
  onClick: () => void;
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

const TaskCard: React.FC<TaskCardProps> = ({ task, expanded, onExpandClick, onSelectTask }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h3">
          {task.task}
        </Typography>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography variant="body2" component="p">
            {task.summary_task}
          </Typography>
        </Collapse>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSelectTask(task.file_name)}
        >
          Select Task
        </Button>
        <ExpandMoreIconButton
          onClick={onExpandClick}
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
