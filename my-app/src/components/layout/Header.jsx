// src/components/layout/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  MenuIcon, CloseIcon, ShoppingCartIcon, 
  UserIcon, SearchIcon, HeartIcon 
} from '../icons';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { MiniCart } from '../../features/cart/components/MiniCart';
import { logout } from '../../features/auth/store/authSlice';

const HeaderContainer = styled.header`
  background-color: var(--black);
  color: var(--white);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: 1400px;
  margin: 0 auto;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 32px;
  margin-left: 48px;
`;

const NavLink = styled(Link)`
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 4px 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary);
    transition: width 0.3s;
  }
  
  &:hover:after, &.active:after {
    width: 100%;
  }
  
  &.active {
    color: var(--primary-light);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--primary);
  color: var(--white);
  font-size: 0.7rem;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transform: translate(30%, -30%);
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: var(--white);
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--black);
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
`;

const MobileNavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MobileNavLink = styled(Link)`
  color: var(--white);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
  position: relative;
  padding: 8px 0;
  
  &.active {
    color: var(--primary);
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 220px;
  overflow: hidden;
  z-index: 100;
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  
  &:hover {
    background-color: var(--grey-100);
  }
  
  svg {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: var(--border);
  margin: 8px 0;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  background: none;
  border: none;
  text-align: right;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  color: var(--error);
  
  &:hover {
    background-color: var(--grey-100);
  }
  
  svg {
    margin-left: 8px;
    width: 16px;
    height: 16px;
  }
`;

export const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItemsCount = useSelector(state => state.cart?.items?.length || 0);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)} aria-label="فتح القائمة">
            <MenuIcon />
          </MobileMenuButton>
          <Logo to="/" />
        </div>
        
        <NavContainer>
          <NavLinks>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              الرئيسية
            </NavLink>
            <NavLink to="/products" className={location.pathname.includes('/products') ? 'active' : ''}>
              المنتجات
            </NavLink>
            <NavLink to="/customize" className={location.pathname === '/customize' ? 'active' : ''}>
              تصميم بدلة
            </NavLink>
            <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              من نحن
            </NavLink>
            <NavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              اتصل بنا
            </NavLink>
          </NavLinks>
        </NavContainer>
        
        <ActionContainer>
          <IconButton aria-label="البحث">
            <SearchIcon />
          </IconButton>
          
          {isAuthenticated && (
            <IconButton aria-label="المفضلة">
              <HeartIcon />
            </IconButton>
          )}
          
          <IconButton 
            aria-label="سلة التسوق"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <ShoppingCartIcon />
            {cartItemsCount > 0 && <Badge>{cartItemsCount}</Badge>}
          </IconButton>
          {cartOpen && (
            <div style={{
              position: 'absolute',
              top: '70px',
              right: '24px',
            }}>
              <MiniCart onClose={() => setCartOpen(false)} />
            </div>
          )}
          
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <IconButton 
                aria-label="حسابي" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <UserIcon />
              </IconButton>
              
              {userMenuOpen && (
                <UserMenu>
                  <UserMenuItem to="/profile">
                    <UserIcon />
                    <span>الملف الشخصي</span>
                  </UserMenuItem>
                  <UserMenuItem to="/orders">
                    <ShoppingCartIcon />
                    <span>طلباتي</span>
                  </UserMenuItem>
                  <UserMenuItem to="/measurements">
                    <UserIcon />
                    <span>قياساتي</span>
                  </UserMenuItem>
                  <UserMenuDivider />
                  <UserMenuButton onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt" />
                    <span>تسجيل الخروج</span>
                  </UserMenuButton>
                </UserMenu>
              )}
            </div>
          ) : (
            <Button variant="primary" size="small" as={Link} to="/login">
              تسجيل الدخول
            </Button>
          )}
        </ActionContainer>
      </HeaderContent>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <MobileMenuHeader>
              <Logo to="/" />
              <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="إغلاق القائمة">
                <CloseIcon />
              </IconButton>
            </MobileMenuHeader>
            
            <MobileNavLinks>
              <MobileNavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
                الرئيسية
              </MobileNavLink>
              <MobileNavLink to="/products" className={location.pathname.includes('/products') ? 'active' : ''}>
                المنتجات
              </MobileNavLink>
              <MobileNavLink to="/customize" className={location.pathname === '/customize' ? 'active' : ''}>
                تصميم بدلة
              </MobileNavLink>
              <MobileNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                من نحن
              </MobileNavLink>
              <MobileNavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                اتصل بنا
              </MobileNavLink>
              
              {isAuthenticated && (
                <>
                  <MobileNavLink to="/profile">
                    الملف الشخصي
                  </MobileNavLink>
                  <MobileNavLink to="/orders">
                    طلباتي
                  </MobileNavLink>
                  <MobileNavLink to="/measurements">
                    قياساتي
                  </MobileNavLink>
                </>
              )}
            </MobileNavLinks>
            
            <div style={{ marginTop: 'auto', padding: '24px 0' }}>
              {isAuthenticated ? (
                <Button variant="primary" size="large" fullWidth onClick={handleLogout}>
                  تسجيل الخروج
                </Button>
              ) : (
                <Button variant="primary" size="large" fullWidth as={Link} to="/login">
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};