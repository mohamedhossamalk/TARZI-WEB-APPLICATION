// src/features/admin/components/users/UsersTable.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  Switch,
  Pagination,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { formatDate } from '../../../../core/utils/formatters';

const getRoleLabel = (role) => {
  switch (role) {
    case 'admin':
      return { label: 'مسؤول', color: 'error' };
    case 'professional':
      return { label: 'مهني', color: 'secondary' };
    case 'user':
    default:
      return { label: 'مستخدم', color: 'primary' };
  }
};

const UsersTable = ({ users = [], onViewUser, onUpdateUserStatus, page, totalPages, onPageChange }) => {
  const handleToggleStatus = (user) => {
    onUpdateUserStatus(user._id, !user.isActive);
  };
  
  if (!users.length) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          لا يوجد مستخدمين لعرضهم
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>المستخدم</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>رقم الهاتف</TableCell>
              <TableCell>الدور</TableCell>
              <TableCell>تاريخ التسجيل</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const role = getRoleLabel(user.role);
              
              return (
                <TableRow hover key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={user.imageUrl}
                        alt={user.username}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Typography variant="body2">{user.username}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || 'غير متوفر'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={role.label} 
                      color={role.color} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={user.isActive}
                          onChange={() => handleToggleStatus(user)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={user.isActive ? 'نشط' : 'غير نشط'}
                    />
                  </TableCell>
                  <TableCell>
                  <Tooltip title="عرض التفاصيل">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onViewUser(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* ترقيم الصفحات */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={onPageChange} 
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default UsersTable;