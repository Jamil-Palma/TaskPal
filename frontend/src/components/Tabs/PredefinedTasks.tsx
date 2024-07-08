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

interface Task {
  task: string;
  summary_task: string;
  file_name: string;
}

interface PredefinedTasksProps {
  setSelectedTaskFilename: (filename: string) => void;
}

const PredefinedTasks: React.FC<PredefinedTasksProps> = ({ setSelectedTaskFilename }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tasks`);
        setTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
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
      tasks.filter((task) =>
        task.task.toLowerCase().includes(query) ||
        task.summary_task.toLowerCase().includes(query)
      )
    );
  };

  const defaultTask: Task = {
    task: "Default Task",
    summary_task: "This is a default task shown when no tasks are available, default task install vs code.",
    file_name: "install_visual_studio_code.json",
  };

  return (
    <Box sx={{ padding: 2 }}>
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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
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
    </Box>
  );
};

export default PredefinedTasks;
