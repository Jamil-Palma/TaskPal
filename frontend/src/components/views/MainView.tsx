import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import PredefinedTasks from '../Tabs/PredefinedTasks';
import UrlTask from '../Tabs/UrlTask';
import InstructionsTask from '../Tabs/InstructionsTask';
import TestTask from '../Tabs/TestTask';
import MessageBar from '../chat/MessageBar';
import Sidebar from '../Sidebar';
import GeminiWelcome from '../Tabs/HomePage';

const MainView: React.FC = () => {
  const [selectedTaskFilename, setSelectedTaskFilename] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTaskSelect = (filename: string) => {
    setSelectedTaskFilename(filename);
    navigate('/message-bar');
  };

  const handleEmptyChat = () => {
    setSelectedTaskFilename(null);
    navigate('/empty-chat');
  };

  return (
    <Box display="flex" margin={0} padding={0}>
      <CssBaseline />
      <Box flex={1} margin={0} padding={0}>
        <Routes>
          <Route
            path="/"
            element={<GeminiWelcome />}
          />
          <Route
            path="/predefined-tasks"
            element={<PredefinedTasks setSelectedTaskFilename={handleTaskSelect} />}
          />
          <Route path="/url-task" element={<UrlTask goToChat={handleTaskSelect} />} />
          <Route path="/instructions-task" element={<InstructionsTask />} />
          <Route path="/test-task" element={<TestTask />} />
          <Route
            path="/message-bar"
            element={<MessageBar selectedTaskFilename={selectedTaskFilename} setSelectedTaskFilename={setSelectedTaskFilename} goToChat={handleTaskSelect}/>}
          />
          <Route
            path="/empty-chat"
            element={<MessageBar selectedTaskFilename={null} setSelectedTaskFilename={setSelectedTaskFilename} goToChat={handleTaskSelect}/>}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default MainView;
