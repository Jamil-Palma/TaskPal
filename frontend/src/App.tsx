import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';

import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './components/views/MainView';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar/>
      <Container>
        <Sidebar />
        <MainView />
      </Container>
    </Router>
  );
};

export default App;
