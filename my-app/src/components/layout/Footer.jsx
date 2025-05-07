// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from '../ui/Logo';

const FooterContainer = styled.footer`
  background-color: var(--black);
  color: var(--white);
  padding: 60px 24px 24px;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--white);
`;

const FooterLink = styled(Link)`
  color: var(--grey-300);
  margin-bottom: 12px;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--white);
  transition: background-color 0.2s, color 0.2s;
  
  &:hover {
    background-color: var(--primary);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: var(--grey-300);
  
  i {
    width: 20px;
    margin-left: 12px;
    color: var(--primary);
  }
`;

const Newsletter = styled.div`
  margin-top: 16px;
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: 16px;
  
  input {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 4px 0 0 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--white);
    
    &::placeholder {
      color: var(--grey-500);
    }
  }
  
  button {
    padding: 12px 16px;
    border: none;
    border-radius: 0 4px 4px 0;
    background-color: var(--primary);
    color: var(--white);
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 40px 0 24px;
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--grey-500);
  font-size: 0.9rem;
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: 24px;
  
  a {
    color: var(--grey-400);
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary);
    }
  }
`;

export const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <Logo light style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--grey-400)', marginBottom: '24px' }}>
            ترزي هو متجر متخصص في بيع وتصميم البدل الرجالية الفاخرة المخصصة حسب القياس.
          </p>
          <SocialLinks>
            <SocialLink href="#" aria-label="فيسبوك">
              <i className="fab fa-facebook-f"></i>
            </SocialLink>
            <SocialLink href="#" aria-label="انستجرام">
              <i className="fab fa-instagram"></i>
            </SocialLink>
            <SocialLink href="#" aria-label="تويتر">
              <i className="fab fa-twitter"></i>
            </SocialLink>
            <SocialLink href="#" aria-label="يوتيوب">
              <i className="fab fa-youtube"></i>
            </SocialLink>
          </SocialLinks>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>روابط سريعة</FooterTitle>
          <FooterLink to="/products">تسوق الآن</FooterLink>
          <FooterLink to="/customize">تصميم بدلة</FooterLink>
          <FooterLink to="/measurements">قياساتي</FooterLink>
          <FooterLink to="/about">من نحن</FooterLink>
          <FooterLink to="/contact">اتصل بنا</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>حسابي</FooterTitle>
          <FooterLink to="/login">تسجيل الدخول</FooterLink>
          <FooterLink to="/register">إنشاء حساب</FooterLink>
          <FooterLink to="/cart">سلة التسوق</FooterLink>
          <FooterLink to="/orders">طلباتي</FooterLink>
          <FooterLink to="/profile">الملف الشخصي</FooterLink>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>تواصل معنا</FooterTitle>
          <ContactItem>
            <i className="fas fa-map-marker-alt"></i>
            <span>15 شارع محمد فريد، وسط البلد، القاهرة</span>
          </ContactItem>
          <ContactItem>
            <i className="fas fa-phone-alt"></i>
            <span>+20123456789</span>
          </ContactItem>
          <ContactItem>
            <i className="fas fa-envelope"></i>
            <span>info@tarzi.com</span>
          </ContactItem>
          
          <Newsletter>
            <p style={{ color: 'var(--grey-400)', marginBottom: '12px' }}>
              اشترك في نشرتنا الإخبارية للحصول على آخر العروض والأخبار
            </p>
            <NewsletterForm>
              <input type="email" placeholder="بريدك الإلكتروني" />
              <button type="submit">اشترك</button>
            </NewsletterForm>
          </Newsletter>
        </FooterColumn>
      </FooterContent>
      
      <Divider />
      
      <FooterBottom>
        <Copyright>
          جميع الحقوق محفوظة &copy; {year} ترزي.
        </Copyright>
        <FooterBottomLinks>
          <Link to="/terms">الشروط والأحكام</Link>
          <Link to="/privacy">سياسة الخصوصية</Link>
        </FooterBottomLinks>
      </FooterBottom>
    </FooterContainer>
  );
};