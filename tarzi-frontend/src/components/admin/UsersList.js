// src/components/Admin/UsersList.js
import React, { useState, useEffect } from 'react';
import { adminUserAPI } from '../../api/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminUserAPI.getAllUsers();
        setUsers(response.data.data || []);
      } catch (err) {
        console.error('فشل في جلب قائمة المستخدمين:', err);
        setError('حدث خطأ أثناء تحميل بيانات المستخدمين. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminUserAPI.toggleUserStatus(userId, !currentStatus);
      
      // تحديث حالة المستخدم محليًا
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isActive: !currentStatus } 
            : user
        )
      );
    } catch (err) {
      console.error('فشل في تحديث حالة المستخدم:', err);
      alert('حدث خطأ أثناء تحديث حالة المستخدم. يرجى المحاولة مرة أخرى.');
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl'
    },
    header: {
      marginBottom: '2rem',
      borderBottom: '1px solid #eee',
      paddingBottom: '1rem'
    },
    title: {
      fontSize: '1.8rem',
      color: '#333'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      textAlign: 'right',
      padding: '1rem',
      borderBottom: '2px solid #eee',
      color: '#333',
      fontWeight: 'bold'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #eee',
      color: '#666'
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold'
    },
    statusActive: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusInactive: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    roleBadge: {
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      backgroundColor: '#e2e3e5',
      color: '#383d41'
    },
    roleAdmin: {
      backgroundColor: '#cce5ff',
      color: '#004085'
    },
    button: {
      padding: '5px 10px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
      marginRight: '5px'
    },
    activateButton: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    deactivateButton: {
      backgroundColor: '#dc3545',
      color: 'white'
    },
    editButton: {
      backgroundColor: '#0d6efd',
      color: 'white'
    },
    loadingOrError: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>إدارة المستخدمين</h1>
        </div>
        <div style={styles.loadingOrError}>جاري تحميل بيانات المستخدمين...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>إدارة المستخدمين</h1>
        </div>
        <div style={styles.loadingOrError}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>إدارة المستخدمين</h1>
      </div>
      
      {users.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>الاسم</th>
              <th style={styles.th}>البريد الإلكتروني</th>
              <th style={styles.th}>الدور</th>
              <th style={styles.th}>الحالة</th>
              <th style={styles.th}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.roleBadge,
                    ...(user.role === 'admin' ? styles.roleAdmin : {})
                  }}>
                    {user.role === 'admin' ? 'مسؤول' : 
                     user.role === 'professional' ? 'مهني' : 'مستخدم'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(user.isActive ? styles.statusActive : styles.statusInactive)
                  }}>
                    {user.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td style={styles.td}>
                  <button 
                    style={{
                      ...styles.button,
                      ...(user.isActive ? styles.deactivateButton : styles.activateButton)
                    }}
                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                  >
                    {user.isActive ? 'إيقاف' : 'تنشيط'}
                  </button>
                  <button 
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => alert('لم يتم تنفيذ هذه الوظيفة بعد')}
                  >
                    تعديل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.loadingOrError}>لا يوجد مستخدمين</div>
      )}
    </div>
  );
};

export default UsersList;