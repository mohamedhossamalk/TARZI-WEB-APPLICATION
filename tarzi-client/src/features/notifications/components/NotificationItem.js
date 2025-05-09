// src/features/notifications/components/NotificationItem.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import {
  ShoppingBag as OrderIcon,
  Message as MessageIcon,
  LocalOffer as OfferIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  DoneAll as DoneAllIcon,
  NotificationsActive as NotificationIcon
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNotifications } from '../../../core/hooks/useNotifications';

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  
  // تعيين أيقونة الإشعار حسب النوع
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <OrderIcon />;
      case 'message':
        return <MessageIcon />;
      case 'offer':
        return <OfferIcon />;
      case 'system':
        return <InfoIcon />;
      default:
        return <NotificationIcon />;
    }
  };
  
  // تعيين لون الإشعار حسب النوع
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order':
        return 'primary.main';
      case 'message':
        return 'info.main';
      case 'offer':
        return 'secondary.main';
      case 'system':
        return 'warning.main';
      default:
        return 'primary.main';
    }
  };
  
  // توجيه المستخدم إلى الصفحة المناسبة عند النقر على الإشعار
  const handleClick = () => {
    // إذا كان الإشعار غير مقروء، يتم تعيينه كمقروء
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // توجيه المستخدم حسب نوع الإشعار
    if (notification.type === 'order' && notification.data?.orderId) {
      navigate(`/orders/${notification.data.orderId}`);
    } else if (notification.type === 'message' && notification.data?.conversationId) {
      navigate(`/messages/${notification.data.conversationId}`);
    } else if (notification.type === 'offer' && notification.data?.offerId) {
      navigate(`/offers/${notification.data.offerId}`);
    } else if (notification.link) {
      navigate(notification.link);
    }
  };
  
  // فتح قائمة الخيارات
  const handleOpenMenu = (event) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };
  
  // إغلاق قائمة الخيارات
  const handleCloseMenu = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setMenuAnchorEl(null);
  };
  
  // تعيين الإشعار كمقروء
  const handleMarkAsRead = (event) => {
    event.stopPropagation();
    markAsRead(notification._id);
    handleCloseMenu();
  };
  
  // حذف الإشعار
  const handleDelete = (event) => {
    event.stopPropagation();
    deleteNotification(notification._id);
    handleCloseMenu();
  };
  
  // تنسيق الوقت منذ إنشاء الإشعار
  const formattedTime = formatDistance(
    new Date(notification.createdAt),
    new Date(),
    { addSuffix: true, locale: ar }
  );

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        borderRadius: 1,
        mb: 1,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        backgroundColor: notification.read ? 'transparent' : 'action.hover',
        '&:hover': {
          backgroundColor: 'action.selected'
        }
      }}
      onClick={handleClick}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
          {getNotificationIcon(notification.type)}
        </Avatar>
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Typography
              variant="subtitle1"
              component="span"
              fontWeight={notification.read ? 'normal' : 'bold'}
            >
              {notification.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="span"
            >
              {formattedTime}
            </Typography>
          </Box>
        }
        secondary={
          <React.Fragment>
            <Typography
              variant="body2"
              color="text.primary"
              component="span"
              sx={{
                display: 'inline',
                opacity: notification.read ? 0.8 : 1
              }}
            >
              {notification.body}
            </Typography>
          </React.Fragment>
        }
      />
      
      <Box>
        <Tooltip title="خيارات">
          <IconButton
            edge="end"
            aria-label="خيارات"
            onClick={handleOpenMenu}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          onClick={(e) => e.stopPropagation()}
        >
          {!notification.read && (
            <MenuItem onClick={handleMarkAsRead}>
              <ListItemIcon>
                <DoneAllIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="تعيين كمقروء" />
            </MenuItem>
          )}
          
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="حذف" />
          </MenuItem>
        </Menu>
      </Box>
    </ListItem>
  );
};

export default NotificationItem;