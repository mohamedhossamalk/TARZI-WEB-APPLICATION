// src/features/notifications/components/NotificationItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  Circle as CircleIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { formatRelativeTime } from '../../../core/utils/formatters';
import { useTranslation } from 'react-i18next';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // اختيار الأيقونة المناسبة حسب نوع الإشعار
  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShippingIcon />;
      case 'payment':
        return <PaymentIcon />;
      case 'account':
        return <PersonIcon />;
      case 'system':
        return <SettingsIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  // اختيار لون الأيقونة حسب نوع الإشعار
  const getIconBgColor = (type) => {
    switch (type) {
      case 'order':
        return 'primary.main';
      case 'payment':
        return 'success.main';
      case 'account':
        return 'info.main';
      case 'system':
        return 'warning.main';
      default:
        return 'grey.500';
    }
  };
  
  // التنقل عند النقر على الإشعار
  const handleClick = () => {
    // إذا كان الإشعار غير مقروء، ضع عليه علامة مقروء
    if (!notification.isRead) {
      onMarkAsRead();
    }
    
    // التنقل بناءً على نوع الإشعار ورابطه
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: notification.isRead ? 'inherit' : 'action.hover',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.selected' }
      }}
      onClick={handleClick}
      secondaryAction={
        <Box>
          {!notification.isRead && (
            <Tooltip title={t('notifications.markAsRead')}>
              <IconButton edge="end" color="primary" onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('general.delete')}>
            <IconButton edge="end" color="error" onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            !notification.isRead && 
            <CircleIcon sx={{ fontSize: 10, color: 'error.main' }} />
          }
        >
          <Avatar sx={{ bgcolor: getIconBgColor(notification.type) }}>
            {getIcon(notification.type)}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            fontWeight={notification.isRead ? 'normal' : 'bold'}
          >
            {notification.title}
          </Typography>
        }
        secondary={
          <React.Fragment>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ display: 'block', mb: 0.5 }}
            >
              {notification.message}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              {formatRelativeTime(notification.createdAt)}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;