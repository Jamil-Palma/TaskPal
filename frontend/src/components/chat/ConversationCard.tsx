import React from 'react';
import { Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ConversationCardProps {
  conversation_id: string;
  summary_task: string;
  all_steps_completed: boolean;
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation_id, summary_task, all_steps_completed, onSelect, onDelete }) => {
  return (
    <Tooltip title={summary_task} arrow placement="top">
      <Card
        style={{
          backgroundColor: all_steps_completed ? 'lightgreen' : 'lightyellow',
          marginBottom: '8px',
          cursor: 'pointer',
          position: 'relative',
          maxHeight: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <CardContent onClick={() => onSelect(conversation_id)}>
          <Typography variant="h6" noWrap>{summary_task}</Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {conversation_id}
          </Typography>
        </CardContent>
        <IconButton
          style={{ position: 'absolute', top: '8px', right: '8px' }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering onSelect
            onDelete(conversation_id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </Tooltip>
  );
};

export default ConversationCard;
