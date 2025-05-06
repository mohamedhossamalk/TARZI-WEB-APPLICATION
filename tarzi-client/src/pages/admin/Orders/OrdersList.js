// src/pages/admin/Orders/OrdersList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '../../../config';
import Pagination from '../../../components/common/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const searchParams = new URLSearchParams();
      searchParams.append('page', currentPage);
      if (statusFilter) searchParams.append('status', statusFilter);
      if (dateFilter) searchParams.append('date', dateFilter);
      if (searchTerm) searchParams.append('search', searchTerm);

      const res = await axios.get(`${API_URL}/api/admin/orders?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.pages);
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">قيد الانتظار</Badge>;
      case 'processing':
        return <Badge bg="info">قيد المعالجة</Badge>;
      case 'shipped':
        return <Badge bg="primary">تم الشحن</Badge>;
      case 'delivered':
        return <Badge bg="success">تم التسليم</Badge>;
      case 'cancelled':
        return <Badge bg="danger">ملغي</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      setError('حدث خطأ أثناء تحديث حالة الطلب.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="orders-list">
      <h1 className="mb-4">إدارة الطلبات</h1>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>بحث وتصفية</Col>
            <Col xs="auto">
              <Button variant="outline-secondary" size="sm" onClick={() => {
                setStatusFilter('');
                setDateFilter('');
                setSearchTerm('');
                setCurrentPage(1);
                fetchOrders();
              }}>
                إعادة تعيين الفلتر
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={3}>
                <Form.Control
                  placeholder="بحث بواسطة رقم الطلب أو اسم المستخدم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="mb-3"
                >
                  <option value="">جميع الحالات</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="mb-3"
                />
              </Col>
              <Col md={3}>
                <Button variant="primary" type="submit" className="w-100">
                  <FaFilter className="me-2" />
                  تصفية
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {orders.length === 0 ? (
        <Alert variant="info">لا توجد طلبات مطابقة للتصفية.</Alert>
      ) : (
        <>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>المستخدم</th>
                <th>التاريخ</th>
                <th>المجموع</th>
                <th>حالة الطلب</th>
                <th>طريقة الدفع</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.substring(0, 8)}</td>
                  <td>
                    {order.user ? (
                      <>
                        {order.user.username}<br />
                        <small className="text-muted">{order.user.email}</small>
                      </>
                    ) : (
                      <span className="text-muted">غير مسجل</span>
                    )}
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    <br />
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleTimeString('ar-EG')}
                    </small>
                  </td>
                  <td>
                    {order.totalAmount} جنيه
                    <br />
                    <small className="text-muted">{order.items.length} منتج</small>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغي</option>
                    </Form.Select>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info">
                      <FaEye className="me-1" />
                      تفاصيل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default OrdersList;