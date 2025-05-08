import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  // أنماط CSS داخلية
  const styles = {
    footer: {
      backgroundColor: '#222',
      color: '#fff',
      padding: '3rem 0',
      fontFamily: 'Cairo, sans-serif',
      direction: 'rtl'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem'
    },
    footerLogo: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '1rem',
      display: 'block',
      textDecoration: 'none'
    },
    footerAbout: {
      color: '#ccc',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem'
    },
    socialIcon: {
      width: '36px',
      height: '36px',
      backgroundColor: '#444',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1.2rem'
    },
    footerTitle: {
      fontSize: '1.2rem',
      color: '#fff',
      marginBottom: '1.5rem',
      fontWeight: 'bold'
    },
    footerLinks: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    footerLinkItem: {
      marginBottom: '0.75rem'
    },
    footerLink: {
      color: '#ccc',
      textDecoration: 'none',
      transition: 'color 0.3s ease'
    },
    contactInfo: {
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'flex-start',
      color: '#ccc'
    },
    contactIcon: {
      marginLeft: '0.5rem',
      color: '#0d6efd'
    },
    newsletter: {
      marginTop: '1rem'
    },
    newsletterInput: {
      padding: '0.75rem',
      borderRadius: '4px',
      border: 'none',
      width: '100%',
      marginBottom: '0.5rem'
    },
    button: {
      backgroundColor: '#0d6efd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '0.75rem',
      fontSize: '1rem',
      cursor: 'pointer',
      width: '100%'
    },
    copyright: {
      borderTop: '1px solid #444',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      textAlign: 'center',
      color: '#ccc'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.footerGrid}>
          <div>
            <Link to="/" style={styles.footerLogo}>ترزي</Link>
            <p style={styles.footerAbout}>
              نقدم خدمات تفصيل وتعديل الملابس بجودة عالية وأسعار مناسبة، مع التركيز على رضا العملاء وتقديم تجربة استثنائية.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialIcon} aria-label="Facebook">ف</a>
              <a href="#" style={styles.socialIcon} aria-label="Instagram">إ</a>
              <a href="#" style={styles.socialIcon} aria-label="Twitter">ت</a>
              <a href="#" style={styles.socialIcon} aria-label="LinkedIn">ل</a>
            </div>
          </div>

          <div>
            <h3 style={styles.footerTitle}>روابط سريعة</h3>
            <ul style={styles.footerLinks}>
              <li style={styles.footerLinkItem}>
                <Link to="/" style={styles.footerLink}>الرئيسية</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/products" style={styles.footerLink}>المنتجات</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>الخدمات</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/about" style={styles.footerLink}>من نحن</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/contact" style={styles.footerLink}>اتصل بنا</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={styles.footerTitle}>خدماتنا</h3>
            <ul style={styles.footerLinks}>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>تفصيل حسب المقاس</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>تعديل الملابس</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>استشارات الأزياء</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>تصميم أزياء خاصة</Link>
              </li>
              <li style={styles.footerLinkItem}>
                <Link to="/services" style={styles.footerLink}>خدمة التسوق الشخصي</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 style={styles.footerTitle}>اتصل بنا</h3>
            <div style={styles.contactInfo}>
              <span style={styles.contactIcon}>📍</span>
              <div>شارع التحرير، وسط البلد، القاهرة، مصر</div>
            </div>
            <div style={styles.contactInfo}>
              <span style={styles.contactIcon}>☎️</span>
              <div>+20 (2) 123-456-7890</div>
            </div>
            <div style={styles.contactInfo}>
              <span style={styles.contactIcon}>✉️</span>
              <div>info@tarzi.com</div>
            </div>
            <div style={styles.newsletter}>
              <h3 style={styles.footerTitle}>النشرة الإخبارية</h3>
              <p style={{ color: '#ccc', marginBottom: '1rem' }}>اشترك للحصول على آخر العروض والتحديثات</p>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                style={styles.newsletterInput}
              />
              <button style={styles.button}>اشترك</button>
            </div>
          </div>
        </div>

        <div style={styles.copyright}>
          <p>© {new Date().getFullYear()} ترزي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;