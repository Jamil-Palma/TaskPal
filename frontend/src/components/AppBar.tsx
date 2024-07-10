import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AppBarComponent: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Chatting with GEMINI!
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
