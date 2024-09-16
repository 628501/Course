import React, { useRef, useEffect } from 'react';
import { Box, IconButton, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, userName = 'Guest', handleLogout }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <Box
      ref={sidebarRef}
      sx={{
        width: 250,
        position: 'fixed',
        top: 0,
        left: open ? 0 : -250,
        height: '100%',
        backgroundColor: 'lightpink',
        transition: 'left 0.3s',
        zIndex: 1200,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          backgroundColor: 'lightcoral',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <AccountCircleIcon sx={{ fontSize: 40, marginRight: 2 }} />
        <Typography variant="h6">{userName}</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <List>
          <ListItem button onClick={() => handleNavigation('/profile')}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/enrolled-courses')}>
            <ListItemText primary="Enrolled Courses" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => userName === 'Guest' ? handleNavigation('/login') : handleLogout()}>
            <ListItemText primary={userName === 'Guest' ? 'Login' : 'Logout'} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;