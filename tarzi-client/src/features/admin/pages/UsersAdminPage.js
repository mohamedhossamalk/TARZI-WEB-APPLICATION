// src/features/admin/pages/UsersAdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import UsersTable from '../components/users/UsersTable';
import UserDetailsAdmin from '../components/users/UserDetailsAdmin';
import adminService from '../services/adminService';

const UsersAdminPage = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // جلب المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const params = {
          page,
          pageSize: 10,
          keyword,
          role,
          status
        };
        
        const response = await adminService.getUsers(params);
        
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        setError('حدث خطأ أثناء جلب المستخدمين');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [page, keyword, role, status, refreshTrigger]);
  
  // معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // تم التنفيذ بالفعل بواسطة useEffect
  };
  
  // مسح البحث
  const handleClearSearch = () => {
    setKeyword('');
    setPage(1);
  };
  
  // تغيير الصفحة
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  // فتح تفاصيل المستخدم
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };
  
  // إغلاق تفاصيل المستخدم
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };
  
  // تحديث حالة المستخدم
  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      await adminService.updateUserStatus(userId, { isActive });
      
      // تحديث حالة المستخدم محليًا
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isActive } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  // تحديث معلومات المستخدم
  const handleUpdateUser = async (userId, userData) => {
    try {
      await adminService.updateUser(userId, userData);
      setRefreshTrigger(prev => prev + 1); // تحديث قائمة المستخدمين
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // سيتم التقاطها في نموذج المستخدم
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          إدارة المستخدمين
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder="بحث بالاسم أو البريد الإلكتروني..."
                size="small"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: keyword ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearSearch}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </form>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>الدور</InputLabel>
              <Select
                value={role}
                label="الدور"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="">جميع الأدوار</MenuItem>
                <MenuItem value="user">مستخدم عادي</MenuItem>
                <MenuItem value="professional">مهني</MenuItem>
                <MenuItem value="admin">مسؤول</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>الحالة</InputLabel>
              <Select
                value={status}
                label="الحالة"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">الكل</MenuItem>
                <MenuItem value="active">نشط</MenuItem>
                <MenuItem value="inactive">غير نشط</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <UsersTable 
          users={users}
          onViewUser={handleViewUser}
          onUpdateUserStatus={handleUpdateUserStatus}
          page={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}
      
      {/* حوار تفاصيل المستخدم */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedUser && (
          <UserDetailsAdmin 
            user={selectedUser}
            onClose={handleCloseDialog}
            onUpdate={handleUpdateUser}
          />
        )}
      </Dialog>
    </Container>
  );
};

export default UsersAdminPage;