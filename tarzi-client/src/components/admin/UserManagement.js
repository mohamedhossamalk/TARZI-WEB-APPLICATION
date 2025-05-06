import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  TablePagination,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getAllUsers, updateUser, deleteUser } from '../../store/actions/adminActions';

const UserManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, loading, error, updateSuccess, deleteSuccess } = useSelector(state => state.admin);
  
  // Table pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Form state
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true
  });
  
  // State for API communication
  const [apiStatus, setApiStatus] = useState({
    message: '',
    type: 'info',
    show: false
  });
  
  // Load users when component mounts
  useEffect(() => {
    loadUsers();
  }, []);
  
  // Function to load users with better error handling
  const loadUsers = () => {
    setApiStatus({ message: 'جارِ تحميل بيانات المستخدمين...', type: 'info', show: true });
    
    dispatch(getAllUsers())
      .then(data => {
        console.log("Users loaded successfully:", data);
        if (!data || (Array.isArray(data) && data.length === 0)) {
          setApiStatus({ 
            message: 'لم يتم العثور على مستخدمين. قد تكون هناك مشكلة في الاتصال بالخادم أو لا يوجد مستخدمين حتى الآن.', 
            type: 'warning', 
            show: true 
          });
        } else {
          setApiStatus({ message: '', type: 'success', show: false });
        }
      })
      .catch(err => {
        console.error("Error loading users:", err);
        setApiStatus({ 
          message: `فشل في تحميل المستخدمين: ${err.message || 'خطأ في الاتصال بالخادم'}`, 
          type: 'error', 
          show: true 
        });
      });
  };
  
  // Reset form after successful operations
  useEffect(() => {
    if (updateSuccess || deleteSuccess) {
      handleCloseUserDialog();
      handleCloseDeleteDialog();
      // Refresh users list
      loadUsers();
    }
  }, [updateSuccess, deleteSuccess]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  // Make sure users is an array
  const safeUsers = Array.isArray(users) ? users : [];
  
  // Filter users based on search term
  const filteredUsers = safeUsers.filter(user =>
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Dialog handlers
  const handleOpenUserDialog = (user = null) => {
    if (user) {
      // Edit mode - populate form
      setCurrentUser(user);
      setUserForm({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: user.isActive !== false // Default to true if not explicitly false
      });
    } else {
      // Create new user
      setCurrentUser(null);
      setUserForm({
        username: '',
        email: '',
        phone: '',
        role: 'user',
        isActive: true
      });
    }
    setOpenUserDialog(true);
  };
  
  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
  };
  
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };
  
  // Form handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmitUser = () => {
    if (currentUser) {
      // Update existing user
      dispatch(updateUser(currentUser._id, userForm))
        .then(() => {
          setApiStatus({ message: 'تم تحديث المستخدم بنجاح', type: 'success', show: true });
          setTimeout(() => setApiStatus({ ...apiStatus, show: false }), 3000);
        })
        .catch(err => {
          setApiStatus({ 
            message: `فشل في تحديث المستخدم: ${err.message || 'خطأ في الاتصال بالخادم'}`, 
            type: 'error', 
            show: true 
          });
        });
    } else {
      // Create new user
      // يتم تنفيذ هذه الوظيفة عند إضافتها
      setApiStatus({ message: 'إضافة المستخدمين غير متاحة حاليًا', type: 'warning', show: true });
    }
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id))
        .then(() => {
          setApiStatus({ message: 'تم حذف المستخدم بنجاح', type: 'success', show: true });
          setTimeout(() => setApiStatus({ ...apiStatus, show: false }), 3000);
        })
        .catch(err => {
          setApiStatus({ 
            message: `فشل في حذف المستخدم: ${err.message || 'خطأ في الاتصال بالخادم'}`, 
            type: 'error', 
            show: true 
          });
        });
    }
  };
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'tailor':
        return 'primary';
      default:
        return 'default';
    }
  };
  
  // إعادة تحميل البيانات
  const handleRefresh = () => {
    loadUsers();
  };
  
  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        {/* Search and refresh section */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('common.search')}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={handleSearch}
          />
          
          <Button 
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            {t('common.refresh')}
          </Button>
        </Box>
        
        {/* Status messages */}
        {apiStatus.show && (
          <Alert severity={apiStatus.type} sx={{ mb: 2 }}>
            {apiStatus.message}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.username')}</TableCell>
                    <TableCell>{t('admin.email')}</TableCell>
                    <TableCell>{t('admin.phone')}</TableCell>
                    <TableCell align="center">{t('admin.role')}</TableCell>
                    <TableCell align="center">{t('admin.status')}</TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user._id}>
                          <TableCell component="th" scope="row">
                            {user.username || 'مستخدم غير معروف'}
                          </TableCell>
                          <TableCell>
                            {user.email || '-'}
                          </TableCell>
                          <TableCell>
                            {user.phone || '-'}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={t(`admin.roles.${user.role}`) || user.role || 'مستخدم'}
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={user.isActive !== false ? t('admin.active') : t('admin.inactive')}
                              color={user.isActive !== false ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenUserDialog(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenDeleteDialog(user)}
                              disabled={user.role === 'admin'} // Prevent deleting admins
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {t('admin.noUsersFound')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t('common.rowsPerPage')}
            />
          </>
        )}
      </Paper>
      
      {/* User Edit Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={handleCloseUserDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser ? t('admin.editUser') : t('admin.addUser')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label={t('auth.username')}
                fullWidth
                required
                value={userForm.username}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label={t('auth.email')}
                fullWidth
                required
                type="email"
                value={userForm.email}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="phone"
                label={t('auth.phone')}
                fullWidth
                value={userForm.phone}
                onChange={handleFormChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="role"
                label={t('admin.role')}
                fullWidth
                select
                value={userForm.role}
                onChange={handleFormChange}
              >
                <MenuItem value="user">{t('admin.roles.user') || 'مستخدم'}</MenuItem>
                <MenuItem value="tailor">{t('admin.roles.tailor') || 'خياط'}</MenuItem>
                <MenuItem value="admin">{t('admin.roles.admin') || 'مدير'}</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={userForm.isActive}
                    onChange={handleFormChange}
                    color="primary"
                  />
                }
                label={t('admin.active') || 'نشط'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>
            {t('common.cancel') || 'إلغاء'}
          </Button>
          <Button
            onClick={handleSubmitUser}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (t('common.save') || 'حفظ')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          {t('admin.deleteUserConfirmation') || 'تأكيد حذف المستخدم'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('admin.deleteUserWarning', { name: userToDelete?.username }) || 
              `هل أنت متأكد من حذف المستخدم "${userToDelete?.username}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            {t('common.cancel') || 'إلغاء'}
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (t('common.delete') || 'حذف')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;