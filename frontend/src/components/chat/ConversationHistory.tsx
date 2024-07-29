
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton, TextField, Button, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/HistoryEdu';
import axiosInstance from '../../axiosConfig';
import '../styles/ConversationHistory.css';
import { format } from 'date-fns';

interface Conversation {
  filename: string;
  conversation_id: string;
  all_steps_completed: boolean;
  summary_task: string;
  registration_date: string;
}

interface ConversationHistoryProps {
  onSelectConversation: (conversationId: string) => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.post('/text/conversations');
        console.log("response history", response?.data);
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.summary_task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleScroll = () => {
    setShowScroll(!showScroll);
  };

  return (
    <Box>
      <Typography variant="h6" style={{ padding: '15px' }}>History</Typography>
      <Box className="searchBox">
        {/* <SearchIcon className="searchIcon" /> */}
        <TextField
          variant="outlined"
          placeholder="Search here!"
          className="searchInput"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent', 
              },
              '&:hover fieldset': {
                borderColor: 'transparent', 
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent', 
              },
            },
          }}
        />
      </Box>
      <List className={`list ${showScroll ? '' : 'no-scroll'}`}>
        {filteredConversations.map((conversation) => (
          
          <ListItem
            key={conversation.conversation_id}
            className="listItem"
            onClick={() => onSelectConversation(conversation.conversation_id)}
          >
            
            <ListItemIcon className="listItemIcon1" >
              <FolderIcon className="listItemIcon" />
            </ListItemIcon>
            <ListItemText
              primary={conversation.summary_task}
              // secondary={conversation.conversation_id}
              secondary ={`New Feature - ${formatDate(conversation.registration_date)}`}
              className="listItemText"
            />
            <IconButton
              edge="end"
              aria-label="delete"
              className="deleteButton"
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
      <Box display="flex" justifyContent="center">
        <Button className="viewMoreButton" onClick={toggleScroll}>
          {showScroll ? 'Hide scroll' : 'View more'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationHistory;
