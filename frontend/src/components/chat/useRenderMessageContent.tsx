import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';
import { fragmentMessage } from './fragmentMessage';

const useRenderMessageContent = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    enqueueSnackbar('Code copied to clipboard', { variant: 'success' });
  };

  const renderMessageContent = (content: string) => {
    const fragments = fragmentMessage(content);

    return fragments.map((fragment, index) => {
      switch (fragment.type) {
        case 'code':
        case 'command':
          return (
            <Box key={index} component="pre" sx={{ position: 'relative', whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: 'rgba(46, 46, 46, 0.8)', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', color: '#ffffff' }}>
              <Button 
                onClick={() => handleCopyCode(fragment.content)}
                sx={{ position: 'absolute', top: '8px', right: '8px', color: '#ffffff' }}
                size="small"
                startIcon={<ContentCopyIcon />}
              >
                Copy
              </Button>
              {fragment.content}
            </Box>
          );
        case 'hint':
          return (
            <Typography key={index} variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {fragment.content}
            </Typography>
          );
        case 'link':
          return (
            <Typography key={index} variant="body1" sx={{ color: '#1976d2' }}>
              <a href={fragment.content} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>{fragment.content}</a>
            </Typography>
          );
        case 'title':
          return (
            <Typography key={index} variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              {fragment.content}
            </Typography>
          );
        case 'instruction':
          return (
            <Typography key={index} variant="body1" sx={{ fontStyle: 'italic', color: '#bbbbbb' }}>
              {fragment.content}
            </Typography>
          );
        case 'text':
        default:
          return (
            <Typography key={index} variant="body1" sx={{ color: '#ffffff', whiteSpace: 'pre-wrap', display: 'inline' }}>
              {fragment.content}
            </Typography>
          );
      }
    });
  };

  return renderMessageContent;
};

export default useRenderMessageContent;
