import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AppBarComponent: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Chatting with NVIDIA AI!
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
