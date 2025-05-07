// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useGetFeaturedProductsQuery } from '../features/products/api/productsApi';
import { ProductCard } from '../features/products/components/ProductCard';
import { Loader } from '../components/ui/Loader';
import { ArrowRightIcon } from '../components/icons';

const HeroSection = styled.section`
  position: relative;
  height: 600px;
  background-color: var(--black);
  color: white;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 500px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
  z-index: 1;
`;

const HeroImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroHeading = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  max-width: 700px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubheading = styled(motion.p)`
  font-size: 1.5rem;
  max-width: 600px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const Section = styled.section`
  padding: 80px 24px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const SectionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-dark);
  }
  
  svg {
    transition: transform 0.2s;
  }
  
  &:hover svg {
    transform: translateX(-4px);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const CategorySection = styled.section`
  background-color: var(--grey-100);
  padding: 80px 24px;
  
  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const CategoryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
    z-index: 1;
    transition: opacity 0.3s;
  }
  
  &:hover::after {
    opacity: 0.8;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CategoryContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 24px;
`;

const CategoryName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const CategoryCount = styled.p`
  font-size: 1rem;
  margin-bottom: 16px;
  opacity: 0.9;
`;

const FeaturesSection = styled.section`
  padding: 80px 24px;
  background-color: var(--white);
  
  @media (max-width: 768px) {
    padding: 60px 24px;
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--red-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  svg {
    width: 40px;
    height: 40px;
    color: var(--primary);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const HomePage = () => {
  const { 
    data: featuredProducts,
    isLoading,
    isError
  } = useGetFeaturedProductsQuery();

  return (
    <>
      <HeroSection>
        <HeroImage src="/images/hero-image.jpg" alt="أناقة ترزي - تصميم مخصص لك" />
        <HeroBackground />
        <HeroContent>
          <HeroHeading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            أناقة مخصصة من ترزي
          </HeroHeading>
          <HeroSubheading
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ملابس مصممة خصيصًا لك بأعلى معايير الجودة وبأسعار منافسة
          </HeroSubheading>
          <HeroActions
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              variant="primary" 
              size="large"
              as={Link}
              to="/products"
            >
              تسوق الآن
            </Button>
            <Button 
              variant="black" 
              size="large"
              as={Link}
              to="/customize"
            >
              صمم بدلتك الخاصة
            </Button>
          </HeroActions>
        </HeroContent>
      </HeroSection>
      
      <Section>
        <SectionHeader>
          <SectionTitle>منتجات مميزة</SectionTitle>
          <SectionLink to="/products">
            عرض جميع المنتجات
            <ArrowRightIcon />
          </SectionLink>
        </SectionHeader>
        
        {isLoading ? (
          <Loader size="large" center />
        ) : isError ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>حدث خطأ أثناء تحميل المنتجات المميزة</p>
            <Button 
              variant="primary" 
              style={{ marginTop: '16px' }}
              onClick={refetch}
            >
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <ProductGrid>
            {featuredProducts?.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductGrid>
        )}
      </Section>
      
      <CategorySection>
        <CategoryContainer>
          <SectionHeader>
            <SectionTitle>تسوق حسب الفئة</SectionTitle>
          </SectionHeader>
          
          <CategoryGrid>
            <CategoryCard to="/products?category=suits">
              <img src="/images/category-suits.jpg" alt="بدل" />
              <CategoryContent>
                <CategoryName>بدل</CategoryName>
                <CategoryCount>30 منتج</CategoryCount>
                <Button variant="primary" size="small">استعرض المنتجات</Button>
              </CategoryContent>
            </CategoryCard>
            
            <CategoryCard to="/products?category=shirts">
              <img src="/images/category-shirts.jpg" alt="قمصان" />
              <CategoryContent>
                <CategoryName>قمصان</CategoryName>
                <CategoryCount>45 منتج</CategoryCount>
                <Button variant="primary" size="small">استعرض المنتجات</Button>
              </CategoryContent>
            </CategoryCard>
            
            <CategoryCard to="/products?category=accessories">
              <img src="/images/category-accessories.jpg" alt="إكسسوارات" />
              <CategoryContent>
                <CategoryName>إكسسوارات</CategoryName>
                <CategoryCount>25 منتج</CategoryCount>
                <Button variant="primary" size="small">استعرض المنتجات</Button>
              </CategoryContent>
            </CategoryCard>
          </CategoryGrid>
        </CategoryContainer>
      </CategorySection>
      
      <FeaturesSection>
        <FeaturesContainer>
          <SectionHeader>
            <SectionTitle>لماذا تختار ترزي؟</SectionTitle>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureItem>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3z" />
                  <path d="M21 12H3M12 3v18" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>تصميم مخصص</FeatureTitle>
              <FeatureDescription>
                نقدم لك خدمة التصميم المخصص بناءً على قياساتك الشخصية لضمان أفضل مقاس لك.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>توصيل سريع</FeatureTitle>
              <FeatureDescription>
                نضمن وصول منتجاتك في الوقت المناسب مع خدمة التوصيل السريع لجميع المحافظات.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10v10m0-10l-8-4m8 8l8-4" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>جودة عالية</FeatureTitle>
              <FeatureDescription>
                نستخدم أفضل الخامات والأقمشة لضمان منتج نهائي بجودة عالية ومتانة تدوم لسنوات.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>تعديلات مجانية</FeatureTitle>
              <FeatureDescription>
                نوفر خدمة تعديلات مجانية لمدة 30 يوماً من تاريخ الشراء لضمان رضاك التام.
              </FeatureDescription>
            </FeatureItem>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
      
      <CategorySection>
        <CategoryContainer style={{ textAlign: 'center' }}>
          <SectionTitle style={{ marginBottom: '24px' }}>انضم إلى عائلتنا</SectionTitle>
          <p style={{ maxWidth: '600px', margin: '0 auto 32px', color: 'var(--text-secondary)' }}>
            كن أول من يعرف عن أحدث التصميمات والعروض الحصرية
          </p>
          
          <form style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '12px' }}>
            <input 
              type="email" 
              placeholder="أدخل بريدك الإلكتروني"
              style={{ 
                flex: 1, 
                padding: '14px 20px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                fontSize: '1rem'
              }}
            />
            <Button variant="black">اشترك</Button>
          </form>
        </CategoryContainer>
      </CategorySection>
    </>
  );
};