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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/HistoryEdu';
import PushPinIcon from '@mui/icons-material/PushPin'; 
import axiosInstance from '../../axiosConfig';
import '../styles/ConversationHistory.css';
import { format } from 'date-fns';

interface Conversation {
  filename: string;
  conversation_id: string;
  all_steps_completed: boolean;
  summary_task: string;
  registration_date: string;
  pinned: boolean;
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
        const conversations: Conversation[] = response.data.conversations.map(
          (conversation: any) => ({
            ...conversation,
            pinned: conversation.pinned || false, // Ensure pinned status is included
          })
        );
        setConversations(conversations);
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

  const handleTogglePinConversation = async (conversationId: string) => {
    try {
      await axiosInstance.post(
        `/text/conversations/${conversationId}/toggle-pin`
      );
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === conversationId
            ? { ...conversation, pinned: !conversation.pinned }
            : conversation
        )
      );
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };

  const handleRenameConversation = async (conversationId: string) => {
    const newName = prompt('Enter new name for the conversation:');
    if (!newName) return;

    try {
      await axiosInstance.post(`/text/conversations/${conversationId}/rename`, {
        new_name: newName,
      });
      // Update the local state to reflect the new name
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === conversationId
            ? { ...conversation, summary_task: newName }
            : conversation
        )
      );
    } catch (error) {
      console.error('Error renaming conversation:', error);
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
    if (action === 'togglePin' && selectedConversation) {
      handleTogglePinConversation(selectedConversation);
    }
    if (action === 'rename' && selectedConversation) {
      handleRenameConversation(selectedConversation);
    }
    handleCloseMenu();
  };

  const filteredConversations = conversations
    .filter((conversation) =>
      conversation.summary_task.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

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
              primary={
                <Box display="flex" alignItems="center">
                  {conversation.pinned && (
                    <PushPinIcon
                      sx={{ marginRight: 1, color: 'secondary.main' }}
                    />
                  )}
                  {conversation.summary_task}
                </Box>
              }
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
        <MenuItem onClick={() => handleMenuItemClick('togglePin')}>
          {selectedConversation &&
          conversations.find((c) => c.conversation_id === selectedConversation)
            ?.pinned
            ? 'Unpin'
            : 'Pin'}
        </MenuItem>
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
