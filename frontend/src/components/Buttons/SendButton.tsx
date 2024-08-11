import React from "react";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface SendButtonProps {
  onClick: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      endIcon={<SendIcon />}
    >
      Send
    </Button>
  );
};

export default SendButton;
