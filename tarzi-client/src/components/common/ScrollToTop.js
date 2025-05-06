import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to scroll to top of the page on route change
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

export default ScrollToTop;