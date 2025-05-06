// src/components/admin/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaUsers, 
  FaShoppingCart, 
  FaCog, 
  FaChartBar, 
  FaList, 
  FaBullhorn,
  FaImage,
  FaShippingFast,
  FaCreditCard
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>تارزي - الإدارة</h2>
      </div>
      
      <div className="sidebar-menu">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaTachometerAlt />
              <span>لوحة التحكم</span>
            </NavLink>
          </li>
          
          <li className="menu-section">المنتجات والفئات</li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaBox />
              <span>المنتجات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaList />
              <span>الفئات</span>
            </NavLink>
          </li>
          
          <li className="menu-section">المستخدمين والطلبات</li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaUsers />
              <span>المستخدمين</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaShoppingCart />
              <span>الطلبات</span>
            </NavLink>
          </li>
          
          <li className="menu-section">إعدادات الموقع</li>
          <li>
            <NavLink to="/admin/settings/general" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCog />
              <span>إعدادات عامة</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings/banners" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaImage />
              <span>البانرات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings/shipping" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaShippingFast />
              <span>طرق الشحن</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/settings/payment" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaCreditCard />
              <span>طرق الدفع</span>
            </NavLink>
          </li>
          
          <li className="menu-section">التقارير</li>
          <li>
            <NavLink to="/admin/reports" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaChartBar />
              <span>التقارير والإحصائيات</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/activity-logs" className={({ isActive }) => isActive ? 'active' : ''}>
              <FaBullhorn />
              <span>سجل الأنشطة</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;