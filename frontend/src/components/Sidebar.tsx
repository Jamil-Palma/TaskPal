import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Drawer, IconButton, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Theme, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import BugReportIcon from '@mui/icons-material/BugReport';
import ChatIcon from '@mui/icons-material/Chat';

const useStyles = makeStyles((theme: Theme) => ({
  sidebar: {
    width: 240,
  },
  drawerPaper: {
    width: 240,
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  listItemActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  listItemIcon: {
    color: 'inherit',
  },
}));

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerToggle }) => {
  const classes = useStyles();
  const location = useLocation();

  const menuItems = [
    { label: 'Predefined Tasks', icon: <AssignmentIcon />, path: '/predefined-tasks' },
    { label: 'Generate your Task!', icon: <LinkIcon />, path: '/url-task' },
    { label: 'Chat', icon: <ChatIcon />, path: '/empty-chat' },
  ];
//  { label: 'Instructions Task', icon: <DescriptionIcon />, path: '/instructions-task' },
//  { label: 'Test Task', icon: <BugReportIcon />, path: '/test-task' },

  return (
    <Drawer
      variant="persistent"
      open={open}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List className={classes.sidebar}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            className={`${classes.listItem} ${location.pathname === item.path && classes.listItemActive}`}
          >
            <ListItemIcon className={classes.listItemIcon}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
