import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

interface CustomAppBarProps {
  title: string | null;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ title }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
