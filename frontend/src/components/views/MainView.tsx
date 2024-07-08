import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PredefinedTasks from '../Tabs/PredefinedTasks';
import UrlTask from '../Tabs/UrlTask';
import InstructionsTask from '../Tabs/InstructionsTask';
import TestTask from '../Tabs/TestTask';
import MessageBar from '../MessageBar';

const MainView: React.FC = () => {
    const [selectedTaskFilename, setSelectedTaskFilename] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleTaskSelect = (filename: string) => {
        setSelectedTaskFilename(filename);
        navigate('/message-bar');
    };

    return (
        <Routes>
            <Route
                path="/predefined-tasks"
                element={<PredefinedTasks setSelectedTaskFilename={handleTaskSelect} />}
            />
            <Route path="/url-task" element={<UrlTask />} />
            <Route path="/instructions-task" element={<InstructionsTask />} />
            <Route path="/test-task" element={<TestTask />} />
            <Route
                path="/message-bar"
                element={<MessageBar selectedTaskFilename={selectedTaskFilename} setSelectedTaskFilename={setSelectedTaskFilename} />}
            />
        </Routes>
    );
};

export default MainView;
