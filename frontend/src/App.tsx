import React, { useState } from "react";
import {
  CssBaseline,
  Box,
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HelpIcon from "@mui/icons-material/Help";
import { BrowserRouter as Router } from "react-router-dom";
import MainView from "./components/views/MainView";
import Sidebar from "./components/Sidebar";
import { Link } from "react-router-dom";
import "./components/styles/styles.css";
import Question_Btn from "./assets/images/Question_Btn.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#37474f",
    },
    secondary: {
      main: "#cfd8dc",
    },
    background: {
      default: "#0a0913",
      paper: "#37474f",
    },
    text: {
      primary: "#ffffff",
      secondary: "#cfd8dc",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgba(0, 0, 0, 0.2)",
          color: "#ffffff",
        },
      },
    },
  },
});

const drawerWidth = 240;

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [openHelp, setOpenHelp] = useState(false);
  const handleOpen = () => setOpenHelp(true);
  const handleClose = () => setOpenHelp(false);

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
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, textAlign: "right" }}>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                <Typography variant="h6" noWrap>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="/TASKPAL.png" // Ruta de la imagen en la carpeta public
                      alt="Logo"
                      style={{ width: "60px", height: "60px", marginRight: "10px" }} // Tamaño aumentado
                    />
                    TASK PAL
                  </Box>
                </Typography>
              </Link>
            </Box>
            <IconButton
              edge="end"
              className="helpIcon"
              aria-label="help"
              onClick={handleOpen}
            >
              <img
                src={Question_Btn}
                alt="Help"
                style={{ width: "65px", height: "60px", marginTop: "20px" }}
              />
              {/* <HelpIcon /> */}
            </IconButton>
          </Toolbar>
        </MuiAppBar>
        <Box display="flex" onClick={handleClickOutside}>
          <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
          <Box
            component="main"
            flex={1}
            ml={open ? `${drawerWidth}px` : "0px"}
            sx={{ transition: "margin 0.3s" }}
            p={0}
          >
            <Toolbar />
            <MainView />
          </Box>
        </Box>
      </Router>
      <Modal
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
        open={openHelp}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openHelp}>
          <Box className="modalStyle">
            <Typography id="help-modal-title" variant="h6" component="h2">
              Help
            </Typography>
            <Typography id="help-modal-description" sx={{ mt: 2 }}>
              Place help information to be displayed to users according to the
              design
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default App;
