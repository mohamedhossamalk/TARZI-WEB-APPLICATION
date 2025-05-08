// src/features/notifications/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  IconButton,
  Divider,
  Button,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../../core/hooks/useNotifications';
import { formatRelativeTime } from '../../../core/utils/formatters';
import NotificationItem from '../components/NotificationItem';

// مكوّن لعرض رمز مناسب حسب نوع الإشعار
const NotificationIcon = ({ type }) => {
  const iconProps = { fontSize: 'small' };
  
  switch (type) {
    case 'order':
      return <ShippingIcon {...iconProps} />;
    case 'payment':
      return <PaymentIcon {...iconProps} />;
    case 'account':
      return <PersonIcon {...iconProps} />;
    case 'system':
      return <SettingsIcon {...iconProps} />;
    default:
      return <InfoIcon {...iconProps} />;
  }
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const {
    notifications,
    fetchAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
    loading,
  } = useNotifications();
  
  const [allNotifications, setAllNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // جلب جميع الإشعارات عند تحميل الصفحة
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // دالة لجلب الإشعارات
  const loadNotifications = async (page = 1) => {
    try {
      const result = await fetchAllNotifications(page);
      if (page === 1) {
        setAllNotifications(result.notifications);
      } else {
        setAllNotifications(prev => [...prev, ...result.notifications]);
      }
      setCurrentPage(result.pagination.page);
      setTotalPages(result.pagination.pages);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
    }
  };
  
  // تحميل المزيد من الإشعارات
  const handleLoadMore = async () => {
    if (loadingMore || currentPage >= totalPages) return;
    
    setLoadingMore(true);
    try {
      await loadNotifications(currentPage + 1);
    } finally {
      setLoadingMore(false);
    }
  };
  
  // تغيير التبويب النشط
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // وضع علامة كمقروء لإشعار
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    // تحديث حالة الإشعار في القائمة
    setAllNotifications(prev =>
      prev.map(notification =>
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  // وضع علامة كمقروء لجميع الإشعارات
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    // تحديث حالة جميع الإشعارات في القائمة
    setAllNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  // فتح حوار حذف الإشعار
  const handleOpenDeleteDialog = (notification) => {
    setSelectedNotification(notification);
    setOpenDeleteDialog(true);
  };
  
  // إغلاق حوار حذف الإشعار
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedNotification(null);
  };
  
  // حذف الإشعار
  const handleDeleteNotification = async () => {
    if (!selectedNotification) return;
    
    await deleteNotification(selectedNotification._id);
    // إزالة الإشعار من القائمة
    setAllNotifications(prev =>
      prev.filter(notification => notification._id !== selectedNotification._id)
    );
    handleCloseDeleteDialog();
  };
  // تصفية الإشعارات حسب التبويب النشط
  const filteredNotifications = allNotifications.filter(notification => {
    if (activeTab === 0) return true; // الكل
    if (activeTab === 1) return !notification.isRead; // غير مقروءة
    if (activeTab === 2) return notification.isRead; // مقروءة
    return true;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t('notifications.notifications')}
        </Typography>
        
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<MarkEmailReadIcon />}
            onClick={handleMarkAllAsRead}
          >
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('general.all')} />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {t('general.new')}
                {unreadCount > 0 && (
                  <Badge
                    color="error"
                    badgeContent={unreadCount}
                    sx={{ mr: 1, ml: 1 }}
                  />
                )}
              </Box>
            }
          />
          <Tab label={t('general.read')} />
        </Tabs>
      </Paper>
      
      {loading && currentPage === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t('notifications.noNotifications')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 1
              ? 'ليس لديك إشعارات جديدة غير مقروءة'
              : activeTab === 2
              ? 'ليس لديك إشعارات مقروءة'
              : 'ليس لديك أي إشعارات'}
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification._id)}
                  onDelete={() => handleOpenDeleteDialog(notification)}
                />
                {index < filteredNotifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          
          {currentPage < totalPages && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Button
                variant="text"
                color="primary"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <CircularProgress size={24} />
                ) : (
                  t('general.showMore')
                )}
              </Button>
            </Box>
          )}
        </Paper>
      )}
      
      {/* حوار تأكيد حذف الإشعار */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-notification-dialog-title"
      >
        <DialogTitle id="delete-notification-dialog-title">
          {t('general.delete')} {t('notifications.notifications')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('general.confirmDelete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('general.cancel')}
          </Button>
          <Button onClick={handleDeleteNotification} color="error" autoFocus>
            {t('general.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotificationsPage;