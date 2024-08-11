import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../axiosConfig";
import backgroundImage from "../../assets/images/Background_for_other_pages.jpg";
import GenerateButton from "../../assets/images/Generate_Task_Btn.png";
import GenerateButtonHover from "../../assets/images/Generate_Task_Btn_Hover.png";
import { styled } from "@mui/system";
import '../styles/MessageBar.css';

interface UrlTaskProps {
  goToChat: (filename: string) => void;
}

const BackgroundImage = styled(Box)`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const ContentContainer = styled(Box)({
  padding: "2rem",
  position: "relative",
  zIndex: 1,
});

const UrlTask: React.FC<UrlTaskProps> = ({ goToChat }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getUrlType = (url: string): string => {
    const videoPlatforms = ["youtube.com", "vimeo.com"];

    try {
      const urlObj = new URL(url);
      if (
        videoPlatforms.some((platform) => urlObj.hostname.includes(platform))
      ) {
        return "video";
      }
      return "page";
    } catch (error) {
      return "unknown";
    }
  };

  const handleGenerateSteps = async () => {
    setError(null);
    setIsLoading(true);

    let endpoint = "";
    let input = "";
    if (isUrl(url)) {
      const urlType = getUrlType(url);
      if (urlType === "unknown") {
        setError("Invalid URL. Please enter a valid URL.");
        setIsLoading(false);
        return;
      }

      if (urlType === "video") {
        endpoint = "/video/video-instructions";
      } else {
        endpoint = "/text/scraping";
      }
      input = "input_text";
    } else {
      endpoint = "/text/generate-steps";
      input = "task";
    }

    try {
      console.log("URL: ", input, " - ", url);
      const response = await axiosInstance.post(endpoint, { [input]: url });
      console.log("RESPONSE VIDEO: ", response.data);
      const filePath = response.data.file_path;
      let cleanedFilePath = filePath.slice(10);

      cleanedFilePath = cleanedFilePath.replace(/\\/g, "");
      console.log("data is : ", cleanedFilePath);
      goToChat(cleanedFilePath);
    } catch (err) {
      setError("Failed to generate steps. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <BackgroundImage />
      <ContentContainer>
        <Typography variant="h4" gutterBottom>
          URL Task
        </Typography>
        <TextField
          className="message-input"
          label="Enter URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ marginBottom: 2, backgroundColor: "rgba(0, 0, 0, 0.7)", borderRadius: "10px", "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent", 
            },
            "&:hover fieldset": {
              borderColor: "transparent", 
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent", 
            },
          },
        }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button
            color="primary"
            onClick={handleGenerateSteps}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{ position: "relative", padding: 0 }}
            disabled={isLoading}
          >
            <img
              src={isHovered ? GenerateButtonHover : GenerateButton}
              alt="Generate Task"
              style={{ width: "100%", height: "100%" }}
            />
            <Typography
              sx={{
                position: "absolute",
                top: "22%",
                left: "57%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
                color: "white",
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
              }}
            >
              Start your Task
            </Typography>
          </Button>
        </Box>
        Enter a video URL, a web page, or simply write the task you want to do!
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {error}
          </Typography>
        )}
        {/* <Box sx={{ marginTop: 2 }}>
          {steps.map((step, index) => (
            <Typography key={index}>
              {index + 1}. {step}
            </Typography>
          ))}
        </Box> */}
      </ContentContainer>
    </Box>
  );
};

export default UrlTask;
