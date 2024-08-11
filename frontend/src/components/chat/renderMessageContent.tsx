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

  return (content: string) => {
    const fragments = fragmentMessage(content);

    return fragments.map((fragment, index) => {
      switch (fragment.type) {
        case 'code':
        case 'command':
          return (
            <Box key={index} component="pre" style={{ position: 'relative', whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', fontFamily: 'monospace', color: '#333' }}>
              <Button 
                onClick={() => handleCopyCode(fragment.content)}
                style={{ position: 'absolute', top: '8px', right: '8px' }}
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
            <Typography key={index} variant="body1" style={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {fragment.content}
            </Typography>
          );
        case 'link':
          return (
            <Typography key={index} variant="body1" style={{ color: '#1976d2' }}>
              <a href={fragment.content} target="_blank" rel="noopener noreferrer">{fragment.content}</a>
            </Typography>
          );
        case 'title':
          return (
            <Typography key={index} variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
              {fragment.content}
            </Typography>
          );
        case 'instruction':
          return (
            <Typography key={index} variant="body1" style={{ fontStyle: 'italic', color: '#555' }}>
              {fragment.content}
            </Typography>
          );
        case 'text':
        default:
          return (
            <Typography key={index} variant="body1" style={{ color: '#333', whiteSpace: 'pre-wrap', display: 'inline' }}>
              {fragment.content}
            </Typography>
          );
      }
    });
  };
};

export default useRenderMessageContent;
