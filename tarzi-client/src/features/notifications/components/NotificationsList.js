// src/features/notifications/components/NotificationsList.js
import React from 'react';
import { List, Typography, Box, Divider, Paper } from '@mui/material';
import NotificationItem from './NotificationItem';

const NotificationsList = ({ notifications = [] }) => {
  // تجميع الإشعارات حسب الأيام
  const groupByDate = (notifications) => {
    const groups = {};
    
    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'اليوم';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'الأمس';
      } else {
        groupKey = date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(notification);
    });
    
    return groups;
  };
  
  const groupedNotifications = groupByDate(notifications);
  const dateGroups = Object.keys(groupedNotifications);

  if (notifications.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا توجد إشعارات حالياً
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {dateGroups.map((date) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, px: 2 }}>
            {date}
          </Typography>
          
          <List>
            {groupedNotifications[date].map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default NotificationsList;