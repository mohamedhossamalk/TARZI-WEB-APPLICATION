// src/features/customize/components/ModelViewer.jsx
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--grey-100);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  
  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    color: var(--grey-500);
  }
`;

export const ModelViewer = ({ customization, ...props }) => {
  const containerRef = useRef(null);
  
  // في حالة توفر WebGL فعلية، يمكن استخدام أي مكتبة مثل Three.js هنا
  // لكن لأغراض العرض، سنستخدم صورة ثابتة كبديل
  
  useEffect(() => {
    // يمكن إضافة كود تهيئة العرض ثلاثي الأبعاد هنا
    console.log('Model viewer initialized with customization:', customization);
    
    return () => {
      // كود التنظيف عند إزالة المكون
    };
  }, [customization]);
  
  // التحقق من وجود الخيارات المختارة
  const hasSelectedOptions = 
    customization?.fabric && 
    customization?.color && 
    customization?.style;
  
  return (
    <Container ref={containerRef} {...props}>
      {hasSelectedOptions ? (
        // في الإنتاج، هنا يتم عرض النموذج ثلاثي الأبعاد
        <img 
          src={`/images/suit-preview-${customization.color?.id || 'default'}.jpg`} 
          alt="Suit Preview" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        <PlaceholderImage>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>اختر التفاصيل لعرض البدلة</p>
        </PlaceholderImage>
      )}
    </Container>
  );
};