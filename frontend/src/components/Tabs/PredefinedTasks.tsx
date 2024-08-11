import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  InputAdornment,
  TextField,
  Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import TaskCard from "../TaskCard";
import backgroundImage from "../../assets/images/Background_for_other_pages.jpg";
import { styled } from "@mui/system";

interface TaskContent {
  task: string;
  summary_task: string;
}

interface Task {
  title: string;
  content?: TaskContent;
  file_name: string;
}

interface TaskWithContent {
  title: string;
  content: TaskContent;
  file_name: string;
}

interface PredefinedTasksProps {
  setSelectedTaskFilename: (filename: string) => void;
}

const BackgroundImage = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const ContentContainer = styled(Box)({
  padding: '2rem',
  position: 'relative',
  zIndex: 1,
});

const PredefinedTasks: React.FC<PredefinedTasksProps> = ({ setSelectedTaskFilename }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/text/tasks`);
        console.log("RESPONSE: ", response.data);
        setTasks(response.data);
        setFilteredTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleExpandClick = (index: number) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredTasks(
      tasks?.filter((task) =>
        task?.title.toLowerCase().includes(query) ||
        task?.content?.task?.toLowerCase().includes(query) ||
        task?.content?.summary_task?.toLowerCase().includes(query)
      )
    );
  };

  const defaultTask: TaskWithContent = {
    title: "install_visual_studio_code.json",
    content: {
      task: "Default Task",
      summary_task: "This is a default task shown when no tasks are available, default task install vs code."
    },
    file_name: "install_visual_studio_code.json"
  };

  const tasksWithContent = filteredTasks.filter((task): task is TaskWithContent => task.content !== undefined);

  return (
    <Box sx={{ position: 'relative' }}>
      <BackgroundImage />
      <ContentContainer>
        <TextField
          variant="outlined"
          placeholder="Search tasks"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <Grid container spacing={2}>
          {tasksWithContent.length > 0 ? (
            tasksWithContent.map((task, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <TaskCard
                  task={task}
                  expanded={expanded[index] || false}
                  onExpandClick={() => handleExpandClick(index)}
                  onSelectTask={setSelectedTaskFilename}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <TaskCard
                task={defaultTask}
                expanded={expanded[0] || false}
                onExpandClick={() => handleExpandClick(0)}
                onSelectTask={setSelectedTaskFilename}
              />
            </Grid>
          )}
        </Grid>
      </ContentContainer>
    </Box>
  );
};

export default PredefinedTasks;
