import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axiosInstance from '../../axiosConfig';

interface UrlTaskProps {
  goToChat: (filename: string) => void;
}


const UrlTask: React.FC<UrlTaskProps> = ({ goToChat }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getUrlType = (url: string): string => {
    const videoPlatforms = ['youtube.com', 'vimeo.com'];

    try {
      const urlObj = new URL(url);
      if (videoPlatforms.some(platform => urlObj.hostname.includes(platform))) {
        return 'video';
      }
      return 'page';
    } catch (error) {
      return 'unknown';
    }
  };

  const handleGenerateSteps = async () => {
    setError(null);

    // const urlType = getUrlType(url);
    // if (urlType === 'unknown') {
    //   setError('Invalid URL. Please enter a valid URL.');
    //   return;
    // }

    let endpoint = '';
    let input = "";
    if (isUrl(url)) {
      const urlType = getUrlType(url);
      if (urlType === 'unknown') {
        setError('Invalid URL. Please enter a valid URL.');
        return;
      }

      if (urlType === 'video') {
        endpoint = '/video/video-instructions';
      } else {
        endpoint = '/text/scraping';
      }
      input = 'input_text';
    } else {
      endpoint = '/text/generate-steps';
      input = 'task';
    }

    try {
      console.log("URL: ", input ," - ",url);
      const response = await axiosInstance.post(endpoint, { [input]: url });
      console.log("RESPONSE VIDEO: ", response.data);
      const filePath = response.data.file_path;
      //const cleanedFilePath = filePath.replace('data/task/', '');
      const cleanedFilePath = filePath.slice(10);

      console.log("data is : " , cleanedFilePath)
      goToChat(cleanedFilePath);
    } catch (err) {
      setError('Failed to generate steps. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
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
      <Button variant="contained" color="primary" onClick={handleGenerateSteps}>
        Generate Steps
      </Button>
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
