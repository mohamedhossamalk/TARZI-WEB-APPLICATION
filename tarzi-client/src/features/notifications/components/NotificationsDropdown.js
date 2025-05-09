// src/features/notifications/components/NotificationsDropdown.js (تكملة)
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Popover,
  List,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Alert,
  ListItemButton,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsNone as NotificationsNoneIcon,
  DoneAll as DoneAllIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNotifications } from '../../../core/hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationsDropdown = () => {
  const { notifications, unreadCount, loading, error, markAllAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // الحد الأقصى لعدد الإشعارات في القائمة المنسدلة
  const MAX_NOTIFICATIONS = 5;

  // فتح القائمة المنسدلة
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق القائمة المنسدلة
  const handleClose = () => {
    setAnchorEl(null);
  };

  // تعيين جميع الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // يتم إظهار الإشعارات الأحدث أولاً
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MAX_NOTIFICATIONS);

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  return (
    <>
      <Tooltip title="الإشعارات">
        <IconButton
          aria-describedby={id}
          onClick={handleOpen}
          color="inherit"
          size="large"
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%', maxHeight: '70vh' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            الإشعارات
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          
          {unreadCount > 0 && (
            <Tooltip title="تعيين الكل كمقروء">
              <IconButton size="small" onClick={handleMarkAllAsRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Divider />
        
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsNoneIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography color="text.secondary">
              لا توجد إشعارات حالياً
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {recentNotifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <NotificationItem
                  notification={notification}
                  onClick={() => handleClose()}
                />
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            component={RouterLink}
            to="/notifications"
            variant="text"
            size="small"
            onClick={handleClose}
          >
            عرض جميع الإشعارات
          </Button>
          
          <Button
            component={RouterLink}
            to="/notifications/settings"
            variant="text"
            size="small"
            startIcon={<SettingsIcon fontSize="small" />}
            onClick={handleClose}
          >
            الإعدادات
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsDropdown;