// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getMyOrders();
        
        // تأكد من أن البيانات هي مصفوفة
        const ordersData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
          
        setOrders(ordersData);
      } catch (err) {
        console.error('فشل في جلب الطلبات:', err);
        setError('حدث خطأ أثناء تحميل بيانات الطلبات');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOverview = () => {
    // تأكد من أن orders مصفوفة قبل استخدام filter
    const pendingOrders = Array.isArray(orders) 
      ? orders.filter(order => order.status === 'pending').length 
      : 0;
      
    const completedOrders = Array.isArray(orders) 
      ? orders.filter(order => order.status === 'delivered').length 
      : 0;
    
    return (
      <div className="dashboard-overview">
        <h2>مرحباً، {user?.username || 'مستخدم'}</h2>
        
        <div className="stats-cards">
          <div className="stat-card">
            <h3>إجمالي الطلبات</h3>
            <p className="stat-value">{Array.isArray(orders) ? orders.length : 0}</p>
          </div>
          
          <div className="stat-card">
            <h3>طلبات قيد الانتظار</h3>
            <p className="stat-value">{pendingOrders}</p>
          </div>
          
          <div className="stat-card">
            <h3>طلبات مكتملة</h3>
            <p className="stat-value">{completedOrders}</p>
          </div>
        </div>
        
        <h3>آخر الطلبات</h3>
        {renderRecentOrders()}
      </div>
    );
  };

  const renderRecentOrders = () => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return <p>لا توجد طلبات سابقة</p>;
    }

    // عرض آخر 5 طلبات
    const recentOrders = orders.slice(0, 5);
    
    return (
      <table className="orders-table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>الإجمالي</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map(order => (
            <tr key={order._id}>
              <td>#{order.orderNumber || order._id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {getStatusText(order.status)}
                </span>
              </td>
              <td>{order.totalPrice} ج.م</td>
              <td>
                <Link to={`/orders/${order._id}`}>عرض التفاصيل</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderOrders = () => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return <p>لا توجد طلبات سابقة</p>;
    }

    return (
      <div className="orders-list">
        <h2>طلباتي</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>الإجمالي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order.orderNumber || order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>{order.totalPrice} ج.م</td>
                <td>
                  <Link to={`/orders/${order._id}`}>عرض التفاصيل</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="profile-section">
        <h2>الملف الشخصي</h2>
        <div className="profile-details">
          <p><strong>الاسم:</strong> {user?.username || 'غير متاح'}</p>
          <p><strong>البريد الإلكتروني:</strong> {user?.email || 'غير متاح'}</p>
          <p><strong>رقم الهاتف:</strong> {user?.phone || 'غير متاح'}</p>
        </div>
        <div className="profile-actions">
          <Link to="/profile" className="btn btn-primary">تعديل الملف الشخصي</Link>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrders();
      case 'profile':
        return renderProfile();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  // وظيفة مساعدة لتحويل حالة الطلب إلى نص عربي
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'قيد الانتظار',
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن',
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي'
    };
    
    return statusMap[status] || status;
  };

  // أنماط CSS داخلية
  const styles = {
    container: {
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto',
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
      color: '#333',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#666',
      fontSize: '1rem',
      margin: 0
    },
    dashboardContent: {
      display: 'flex',
      gap: '2rem'
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      padding: '1.5rem'
    },
    mainContent: {
      flex: 1
    },
    tabs: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    tabItem: {
      margin: '0.5rem 0',
      padding: '0.75rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    activeTab: {
      backgroundColor: '#e9ecef',
      fontWeight: 'bold'
    },
    statsCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#0d6efd',
      marginTop: '0.5rem'
    },
    ordersTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      padding: '1rem',
      textAlign: 'right',
      borderBottom: '2px solid #eee',
      backgroundColor: '#f8f9fa'
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #eee'
    },
    statusBadge: {
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      display: 'inline-block'
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    statusProcessing: {
      backgroundColor: '#d1ecf1',
      color: '#0c5460'
    },
    statusShipped: {
      backgroundColor: '#d1e7dd',
      color: '#0f5132'
    },
    statusDelivered: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusCancelled: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    link: {
      color: '#0d6efd',
      textDecoration: 'none'
    },
    loadingOrError: {
      textAlign: 'center',
      padding: '3rem 0',
      color: '#666'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingOrError}>جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingOrError}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>لوحة التحكم</h1>
        <p style={styles.subtitle}>مرحباً بك في حسابك الشخصي</p>
      </div>
      
      <div style={styles.dashboardContent}>
        <div style={styles.sidebar}>
          <ul style={styles.tabs}>
            <li 
              style={{
                ...styles.tabItem,
                ...(activeTab === 'overview' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('overview')}
            >
              نظرة عامة
            </li>
            <li 
              style={{
                ...styles.tabItem,
                ...(activeTab === 'orders' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('orders')}
            >
              طلباتي
            </li>
            <li 
              style={{
                ...styles.tabItem,
                ...(activeTab === 'profile' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('profile')}
            >
              الملف الشخصي
            </li>
          </ul>
        </div>
        
        <div style={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;