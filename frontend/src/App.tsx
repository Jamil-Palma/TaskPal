import React, { useState } from 'react';
import { CssBaseline, Box, IconButton, AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router } from 'react-router-dom';
import MainView from './components/views/MainView';
import Sidebar from './components/Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#37474f', 
    },
    secondary: {
      main: '#cfd8dc',
    },
    background: {
      default: '#0a0913', 
      paper: '#37474f', 
    },
    text: {
      primary: '#ffffff', 
      secondary: '#cfd8dc', 
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(0, 0, 0, 0.2)',
          color: '#ffffff',
        },
      },
    },
  },
});


const drawerWidth = 240;

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleClickOutside = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <MuiAppBar position="fixed" style={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Chatting with GEMINI!
            </Typography>
          </Toolbar>
        </MuiAppBar>
        <Box display="flex" onClick={handleClickOutside}>
          <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            flex={1}
            ml={open ? `${drawerWidth}px` : '0px'}
            sx={{ transition: 'margin 0.3s' }}
            p={3}
          >
            <Toolbar />
            <MainView />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;