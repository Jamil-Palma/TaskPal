import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.post('/text/conversations');
        console.log('response history', response?.data);
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
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation.conversation_id !== conversationId
        )
      );
      handleCloseMenu();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const handleClickMenu = (
    event: React.MouseEvent<HTMLElement>,
    conversationId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedConversation(conversationId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedConversation(null);
  };

  const handleMenuItemClick = (action: string) => {
    if (action === 'delete' && selectedConversation) {
      handleDeleteConversation(selectedConversation);
    }
    if (action === 'pin' && selectedConversation) {
      setConversations((prevConversations) => {
        const conversationIndex = prevConversations.findIndex(
          (conversation) =>
            conversation.conversation_id === selectedConversation
        );
        if (conversationIndex !== -1) {
          const [pinnedConversation] = prevConversations.splice(
            conversationIndex,
            1
          );
          return [pinnedConversation, ...prevConversations];
        }
        return prevConversations;
      });
    }
    if (action === 'rename') {
      console.log('Rename conversation');
    }
    handleCloseMenu();
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.summary_task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleScroll = () => {
    setShowScroll(!showScroll);
  };

  return (
    <Box>
      <Typography variant="h6" style={{ padding: '15px' }}>
        History
      </Typography>
      <Box className="searchBox">
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
            <ListItemIcon className="listItemIcon1">
              <FolderIcon className="listItemIcon" />
            </ListItemIcon>
            <ListItemText
              primary={conversation.summary_task}
              secondary={`New Feature - ${formatDate(
                conversation.registration_date
              )}`}
              className="listItemText"
            />
            <IconButton
              edge="end"
              aria-label="more"
              className="deleteButton"
              onClick={(e) => {
                e.stopPropagation();
                handleClickMenu(e, conversation.conversation_id);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('pin')}>Pin</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('rename')}>
          Rename
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('delete')}>
          Delete
        </MenuItem>
      </Menu>
      <Box display="flex" justifyContent="center">
        <Button className="viewMoreButton" onClick={toggleScroll}>
          {showScroll ? 'Hide scroll' : 'View more'}
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationHistory;
