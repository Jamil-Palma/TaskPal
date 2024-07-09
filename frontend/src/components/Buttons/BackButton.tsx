import React from "react";
import { Button } from "@mui/material";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} variant="contained" color="secondary" style={{ marginTop: '16px' }}>
      Back to Task Selection
    </Button>
  );
};

export default BackButton;
