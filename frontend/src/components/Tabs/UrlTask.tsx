import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axiosInstance from "../../axiosConfig";
import background from "../../assets/images/Background_for_other_pages.jpg";
import GenerateButton from "../../assets/images/Generate_Task_Btn.png";
import GenerateButtonHover from "../../assets/images/Generate_Task_Btn_Hover.png";

interface UrlTaskProps {
  goToChat: (filename: string) => void;
}

const UrlTask: React.FC<UrlTaskProps> = ({ goToChat }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

    // const urlType = getUrlType(url);
    // if (urlType === 'unknown') {
    //   setError('Invalid URL. Please enter a valid URL.');
    //   return;
    // }

    let endpoint = "";
    let input = "";
    if (isUrl(url)) {
      const urlType = getUrlType(url);
      if (urlType === "unknown") {
        setError("Invalid URL. Please enter a valid URL.");
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
      // //const cleanedFilePath = filePath.replace('data/task/', '');
      let cleanedFilePath = filePath.slice(10);

      cleanedFilePath = cleanedFilePath.replace(/\\/g, "");
      console.log("data is : ", cleanedFilePath);
      goToChat(cleanedFilePath);
    } catch (err) {
      setError("Failed to generate steps. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "background.default",
        borderRadius: 2,
      }}
    >
      <Box
        component="img"
        src={background}
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <Typography variant="h4" gutterBottom>
        URL Task
      </Typography>
      <TextField
        label="Enter URL"
        variant="outlined"
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          color="primary"
          onClick={handleGenerateSteps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{ position: "relative", padding: 0 }}
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
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Generate Task
          </Typography>
        </Button>
      </Box>
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
    </Box>
  );
};

export default UrlTask;
