// src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Alert } from 'react-bootstrap';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../config';
import DashboardChart from '../../components/admin/DashboardChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStats(res.data.stats);
        setLoading(false);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!stats) return null;

  return (
    <div className="dashboard">
      <h1 className="mb-4">لوحة التحكم</h1>

      {/* إحصائيات سريعة */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaShoppingCart className="icon-large mb-3" />
              <h2>{stats.orders.total}</h2>
              <p>إجمالي الطلبات</p>
              <div className="small text-muted">
                {stats.orders.pending} قيد الانتظار | {stats.orders.completed} مكتملة
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaUsers className="icon-large mb-3" />
              <h2>{stats.users}</h2>
              <p>المستخدمين</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaBoxOpen className="icon-large mb-3" />
              <h2>{stats.products.total}</h2>
              <p>المنتجات</p>
              <div className="small text-muted">
                {stats.products.outOfStock} نفذت من المخزون
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <FaDollarSign className="icon-large mb-3" />
              <h2>{stats.sales.total.toLocaleString()} جنيه</h2>
              <p>إجمالي المبيعات</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* رسم بياني للمبيعات */}
      <Card className="mb-4">
        <Card.Header>المبيعات حسب الفئة</Card.Header>
        <Card.Body>
          <DashboardChart data={stats.sales.byCategory} />
        </Card.Body>
      </Card>

      {/* أحدث الطلبات */}
      <Card>
        <Card.Header>آخر الطلبات</Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المستخدم</th>
                <th>التاريخ</th>
                <th>المبلغ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>{order.user?.username || 'غير معروف'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td>{order.totalAmount} جنيه</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status === 'pending' ? 'قيد الانتظار' : 
                       order.status === 'processing' ? 'قيد المعالجة' :
                       order.status === 'shipped' ? 'تم الشحن' : 'مكتمل'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;