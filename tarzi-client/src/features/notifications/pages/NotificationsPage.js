// src/features/notifications/pages/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import {
  Home as HomeIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  DeleteOutline as DeleteIcon,
  DoneAll as DoneAllIcon,
  FilterList as FilterListIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { useNotifications } from '../../../core/hooks/useNotifications';
import notificationService from '../services/notificationService';
import NotificationsList from '../components/NotificationsList';

// مكون TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, error, markAllAsRead, deleteAllNotifications } = useNotifications();
  
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  
  const notificationTypes = [
    { id: 'all', label: 'الكل' },
    { id: 'order', label: 'الطلبات' },
    { id: 'message', label: 'الرسائل' },
    { id: 'system', label: 'النظام' },
    { id: 'offer', label: 'العروض' }
  ];

  useEffect(() => {
    // تحديث الإشعارات من الخدمة
    notificationService.getNotifications();
  }, []);

  // تغيير التبويب
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // فتح قائمة الخيارات
  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // إغلاق قائمة الخيارات
  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // فتح قائمة الفلترة
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  // إغلاق قائمة الفلترة
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchorEl(null);
  };

  // تعيين نوع الفلترة
  const handleSetFilter = (type) => {
    setSelectedType(type);
    handleCloseFilterMenu();
  };

  // وضع علامة على جميع الإشعارات كمقروءة
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    handleCloseMenu();
  };

  // حذف جميع الإشعارات
  const handleDeleteAll = async () => {
    await deleteAllNotifications();
    handleCloseMenu();
  };

  // فلترة الإشعارات حسب النوع ووضع القراءة
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // فلترة حسب النوع
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType);
    }
    
    // فلترة حسب وضع القراءة
    if (tabValue === 1) {
      filtered = filtered.filter(notification => notification.read);
    } else if (tabValue === 2) {
      filtered = filtered.filter(notification => !notification.read);
    }
    
    return filtered;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs separator={<KeyboardArrowLeftIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          الرئيسية
        </Link>
        <Typography color="text.primary">الإشعارات</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationsActiveIcon color="primary" sx={{ mr: 1 }} />
          الإشعارات
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
        
        <Box>
          <IconButton
            onClick={handleOpenFilterMenu}
            aria-label="تصفية"
            size="small"
            sx={{ mr: 1 }}
          >
            <FilterListIcon />
          </IconButton>
          
          <IconButton
            onClick={handleOpenMenu}
            aria-label="المزيد من الخيارات"
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="الكل" />
            <Tab label="المقروءة" />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  غير المقروءة
                </Badge>
              } 
            />
          </Tabs>
        </Box>
        
        {error && (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              {error}
            </Alert>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <NotificationsList notifications={getFilteredNotifications()} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <NotificationsList notifications={getFilteredNotifications()} />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <NotificationsList notifications={getFilteredNotifications()} />
            </TabPanel>
          </>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          component={RouterLink}
          to="/notifications/settings"
          variant="outlined"
          startIcon={<SettingsIcon />}
        >
          إعدادات الإشعارات
        </Button>
      </Box>
      
      {/* قائمة الخيارات */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleMarkAllAsRead}>
          <ListItemIcon>
            <DoneAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="تعيين الكل كمقروء" />
        </MenuItem>
        <MenuItem onClick={handleDeleteAll}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="حذف جميع الإشعارات" />
        </MenuItem>
        <MenuItem component={RouterLink} to="/notifications/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="إعدادات الإشعارات" />
        </MenuItem>
      </Menu>
      
      {/* قائمة الفلترة */}
      <Menu
        anchorEl={filterMenuAnchorEl}
        open={Boolean(filterMenuAnchorEl)}
        onClose={handleCloseFilterMenu}
      >
        {notificationTypes.map((type) => (
          <MenuItem
            key={type.id}
            onClick={() => handleSetFilter(type.id)}
            selected={selectedType === type.id}
          >
            {type.label}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
};

export default NotificationsPage;