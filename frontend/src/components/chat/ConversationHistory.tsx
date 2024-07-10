import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import axiosInstance from '../../axiosConfig';

interface Conversation {
  filename: string;
  conversation_id: string;
  all_steps_completed: boolean;
  summary_task: string;
}

interface ConversationHistoryProps {
  onSelectConversation: (conversationId: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
    color: theme.palette.text.primary,
  },
  listItemText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main,
  },
}));

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ onSelectConversation }) => {
  const classes = useStyles();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.post('/text/conversations');
        console.log("response", response?.data);
        setConversations(response.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
  

    fetchConversations();
  }, []);


  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await axiosInstance.delete(`/text/conversations/${conversationId}`);
      setConversations(prevConversations => prevConversations.filter(conversation => conversation.conversation_id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" style={{ color: 'white' }}>Conversation History</Typography>
      <List style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.conversation_id}
            className={classes.listItem}
            onClick={() => onSelectConversation(conversation.conversation_id)}
          >
            <ListItemText
              primary={conversation.summary_task}
              secondary={conversation.conversation_id}
              className={classes.listItemText}
            />
            <IconButton
              edge="end"
              aria-label="delete"
              className={classes.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConversation(conversation.conversation_id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ConversationHistory;
