// src/components/layout/AdminSidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  DashboardIcon, ShoppingCartIcon, UsersIcon,
  PackageIcon, CreditCardIcon, TagIcon, 
  SettingsIcon, ChevronDownIcon 
} from '../icons';

const SidebarContainer = styled.aside`
  background-color: var(--black);
  color: var(--white);
  width: 280px;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  transition: transform 0.3s;
  overflow-y: auto;
  
  @media (max-width: 992px) {
    transform: ${props => props.open ? 'translateX(0)' : 'translateX(100%)'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
`;

const SidebarContent = styled.div`
  padding: 24px 0;
`;

const SidebarSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--grey-500);
  padding: 0 24px;
  margin-bottom: 8px;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: var(--grey-300);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background-color: var(--primary);
    transform: scaleY(0);
    transition: transform 0.2s;
  }
  
  &.active {
    color: var(--white);
    background-color: rgba(255, 255, 255, 0.05);
    
    &::before {
      transform: scaleY(1);
    }
    
    svg {
      color: var(--primary);
    }
  }
  
  &:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.03);
    color: var(--white);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    color: var(--grey-500);
    transition: color 0.2s;
  }
`;

const SubNavItems = styled(motion.div)`
  padding-right: 36px;
  overflow: hidden;
`;

const SubNavItem = styled(NavLink)`
  display: block;
  padding: 10px 24px;
  color: var(--grey-400);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &.active {
    color: var(--primary);
  }
  
  &:hover:not(.active) {
    color: var(--white);
  }
`;

const CollapseButton = styled.span`
  margin-right: auto;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  
  svg {
    margin: 0 !important;
    width: 16px !important;
    height: 16px !important;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.8rem;
  color: var(--grey-500);
`;

export const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({
    products: true,
  });
  
  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <SidebarContainer open={isOpen}>
      <SidebarHeader>
        <Logo>ترزي - لوحة الإدارة</Logo>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSection>
          <SectionTitle>عام</SectionTitle>
          <NavItems>
            <NavItem to="/admin" end>
              <DashboardIcon />
              الرئيسية
            </NavItem>
            <NavItem to="/admin/orders">
              <ShoppingCartIcon />
              الطلبات
            </NavItem>
          </NavItems>
        </SidebarSection>
        
        <SidebarSection>
          <SectionTitle>إدارة</SectionTitle>
          <NavItems>
            <NavItem 
              to="#" 
              className={location.pathname.includes('/admin/products') ? 'active' : ''} 
              onClick={(e) => {
                e.preventDefault();
                toggleSubmenu('products');
              }}
            >
              <PackageIcon />
              المنتجات
              <CollapseButton isOpen={openSubmenus.products}>
                <ChevronDownIcon />
              </CollapseButton>
            </NavItem>
            
            {openSubmenus.products && (
              <SubNavItems
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SubNavItem to="/admin/products">جميع المنتجات</SubNavItem>
                <SubNavItem to="/admin/products/add">إضافة منتج</SubNavItem>
                <SubNavItem to="/admin/products/categories">التصنيفات</SubNavItem>
              </SubNavItems>
            )}
            
            <NavItem to="/admin/users">
              <UsersIcon />
              المستخدمون
            </NavItem>
            
            <NavItem to="/admin/transactions">
              <CreditCardIcon />
              المعاملات المالية
            </NavItem>
          </NavItems>
        </SidebarSection>
        
        <SidebarSection>
          <SectionTitle>الإعدادات</SectionTitle>
          <NavItems>
            <NavItem to="/admin/settings">
              <SettingsIcon />
              إعدادات النظام
            </NavItem>
          </NavItems>
        </SidebarSection>
      </SidebarContent>
      
      <SidebarFooter>
        ترزي - جميع الحقوق محفوظة © {new Date().getFullYear()}
      </SidebarFooter>
    </SidebarContainer>
  );
};