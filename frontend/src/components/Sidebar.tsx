import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Tabs orientation="vertical">
      <Tab label="Predefined Tasks" component={Link} to="/predefined-tasks" />
      <Tab label="URL Task" component={Link} to="/url-task" />
      <Tab label="Instructions Task" component={Link} to="/instructions-task" />
      <Tab label="Test Task" component={Link} to="/test-task" />
    </Tabs>
  );
};

export default Sidebar;
