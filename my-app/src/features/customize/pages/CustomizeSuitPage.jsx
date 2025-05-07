// src/features/customize/pages/CustomizeSuitPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Stepper, Step } from '../../../components/ui/Stepper';
import { useToast } from '../../../hooks/useToast';
import { ColorPalette } from '../components/ColorPalette';
import { FabricSelector } from '../components/FabricSelector';
import { ModelViewer } from '../components/ModelViewer';
import { StyleSelector } from '../components/StyleSelector';
import { MeasurementSelector } from '../components/MeasurementSelector';

import { useGetProductQuery } from '../api/productsApi';



const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

const Description = styled.p`
  color: var(--text-secondary);
  max-width: 800px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewSection = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const SelectorSection = styled.div`
  padding: 24px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`;

const PriceTag = styled.div`
  background-color: var(--black);
  color: var(--white);
  padding: 16px 24px;
  margin-top: 24px;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CustomizeSuitPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  
  // Initialize state for customization options
  const [customization, setCustomization] = useState({
    suitType: 'two-piece',
    fabric: null,
    color: null,
    style: null,
    details: {
      buttons: '2',
      lapel: 'notch',
      vent: 'center',
      pocket: 'flap',
      lining: 'standard'
    },
    measurements: null,
    price: 1500
  });
  
  // Steps data
  const steps = [
    { id: 0, title: 'النوع والنسيج' },
    { id: 1, title: 'اللون' },
    { id: 2, title: 'القصة والتفاصيل' },
    { id: 3, title: 'القياسات' },
    { id: 4, title: 'المراجعة' }
  ];
  
  // Handle step navigation
  const handleNext = () => {
    if (activeStep === 0 && !customization.fabric) {
      return showToast('يرجى اختيار نوع النسيج أولاً', 'error');
    }
    
    if (activeStep === 1 && !customization.color) {
      return showToast('يرجى اختيار اللون أولاً', 'error');
    }
    
    if (activeStep === 2 && !customization.style) {
      return showToast('يرجى اختيار القصة أولاً', 'error');
    }
    
    if (activeStep === 3 && !customization.measurements) {
      return showToast('يرجى اختيار أو إضافة القياسات أولاً', 'error');
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Update customization state
  const updateCustomization = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Update nested details
  const updateDetails = (key, value) => {
    setCustomization(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value
      }
    }));
  };
  
  // Handle adding to cart
  const handleAddToCart = () => {
    // Logic to add custom suit to cart
    showToast('تمت إضافة البدلة المخصصة إلى السلة', 'success');
    navigate('/cart');
  };

  return (
    <PageContainer>
      <Header>
        <Title>صمم بدلتك الخاصة</Title>
        <Description>
          قم بإنشاء بدلة مخصصة حسب ذوقك ومقاساتك. اختر القماش، اللون، القصة والتفاصيل التي تفضلها.
        </Description>
      </Header>
      
      <Stepper activeStep={activeStep}>
        {steps.map(step => (
          <Step 
            key={step.id} 
            label={step.title} 
            onClick={() => {
              // Only allow going back to previous steps
              if (step.id < activeStep) {
                setActiveStep(step.id);
              }
            }} 
          />
        ))}
      </Stepper>
      
      <ContentContainer>
        <SelectorSection>
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ marginBottom: '24px' }}>اختر نوع البدلة والنسيج</h2>
                
                <div style={{ marginBottom: '24px' }}>
                  <Select
                    label="نوع البدلة"
                    value={customization.suitType}
                    onChange={(e) => updateCustomization('suitType', e.target.value)}
                    options={[
                      { value: 'two-piece', label: 'بدلة ثنائية (سترة وبنطلون)' },
                      { value: 'three-piece', label: 'بدلة ثلاثية (سترة، صديري، بنطلون)' },
                    ]}
                  />
                </div>
                
                <FabricSelector
                  selected={customization.fabric}
                  onChange={(fabric) => updateCustomization('fabric', fabric)}
                  fabricOptions={[
                    { id: 'wool', name: 'صوف 100%', description: 'فاخر ومريح', price: 0 },
                    { id: 'cotton', name: 'قطن مخلوط', description: 'خفيف ومناسب للطقس الحار', price: -200 },
                    { id: 'cashmere', name: 'كشمير', description: 'ناعم وفاخر', price: 500 },
                    { id: 'linen', name: 'كتان', description: 'منعش وعصري', price: 100 },
                  ]}
                />
              </motion.div>
            )}
            
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ marginBottom: '24px' }}>اختر اللون</h2>
                
                <ColorPalette
                  selected={customization.color}
                  onChange={(color) => updateCustomization('color', color)}
                  colorOptions={[
                    { id: 'navy', name: 'كحلي', hex: '#1A2B49' },
                    { id: 'charcoal', name: 'فحمي', hex: '#36454F' },
                    { id: 'black', name: 'أسود', hex: '#000000' },
                    { id: 'grey', name: 'رمادي', hex: '#808080' },
                    { id: 'brown', name: 'بني', hex: '#654321' },
                    { id: 'burgundy', name: 'نبيذي', hex: '#800020' },
                  ]}
                />
              </motion.div>
            )}
            
            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ marginBottom: '24px' }}>اختر القصة والتفاصيل</h2>
                
                <StyleSelector
                  selected={customization.style}
                  onChange={(style) => updateCustomization('style', style)}
                  styleOptions={[
                    { id: 'classic', name: 'كلاسيك', description: 'قصة تقليدية أنيقة' },
                    { id: 'slim', name: 'سليم فيت', description: 'قصة ضيقة عصرية' },
                    { id: 'modern', name: 'مودرن', description: 'قصة متوازنة بين الكلاسيك والسليم' },
                    { id: 'tailored', name: 'تايلورد', description: 'قصة مخصصة تناسب شكل الجسم' },
                  ]}
                />
                
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ marginBottom: '16px' }}>تفاصيل إضافية</h3>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <Select
                      label="الأزرار"
                      value={customization.details.buttons}
                      onChange={(e) => updateDetails('buttons', e.target.value)}
                      options={[
                        { value: '1', label: 'زر واحد' },
                        { value: '2', label: 'زران' },
                        { value: '3', label: 'ثلاثة أزرار' },
                      ]}
                    />
                    
                    <Select
                      label="طية الصدر"
                      value={customization.details.lapel}
                      onChange={(e) => updateDetails('lapel', e.target.value)}
                      options={[
                        { value: 'notch', label: 'طية عادية' },
                        { value: 'peak', label: 'طية مدببة' },
                        { value: 'shawl', label: 'طية شال' },
                      ]}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <Select
                      label="فتحة الظهر"
                      value={customization.details.vent}
                      onChange={(e) => updateDetails('vent', e.target.value)}
                      options={[
                        { value: 'none', label: 'بدون فتحة' },
                        { value: 'center', label: 'فتحة وسط' },
                        { value: 'side', label: 'فتحات جانبية' },
                      ]}
                    />
                    
                    <Select
                      label="الجيوب"
                      value={customization.details.pocket}
                      onChange={(e) => updateDetails('pocket', e.target.value)}
                      options={[
                        { value: 'flap', label: 'جيب بغطاء' },
                        { value: 'patch', label: 'جيب مضاف' },
                        { value: 'ticket', label: 'جيب تذكرة' },
                      ]}
                    />
                  </div>
                  
                  <Select
                    label="البطانة"
                    value={customization.details.lining}
                    onChange={(e) => updateDetails('lining', e.target.value)}
                    options={[
                      { value: 'standard', label: 'بطانة قياسية' },
                      { value: 'premium', label: 'بطانة فاخرة' },
                      { value: 'silk', label: 'بطانة حرير' },
                    ]}
                  />
                </div>
              </motion.div>
            )}
            
            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ marginBottom: '24px' }}>اختر القياسات</h2>
                
                <MeasurementSelector
                  selected={customization.measurements}
                  onChange={(measurements) => updateCustomization('measurements', measurements)}
                />
              </motion.div>
            )}
            
            {activeStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 style={{ marginBottom: '24px' }}>مراجعة التصميم</h2>
                
                <SummaryView 
                  customization={customization} 
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <NavigationButtons>
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              السابق
            </Button>
            
            {activeStep < steps.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                التالي
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleAddToCart}
              >
                إضافة إلى السلة
              </Button>
            )}
          </NavigationButtons>
        </SelectorSection>
        
        <PreviewSection>
          <div style={{ 
            background: 'var(--white)', 
            padding: '16px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>معاينة</h3>
            
            <ModelViewer 
              customization={customization} 
              style={{ height: '400px', width: '100%' }}
            />
            
            <PriceTag>
              <span>السعر النهائي:</span>
              <span>{customization.price} ج.م</span>
            </PriceTag>
          </div>
        </PreviewSection>
      </ContentContainer>
    </PageContainer>
  );
};