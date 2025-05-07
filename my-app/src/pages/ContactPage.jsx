// src/pages/ContactPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from "../components/ui/Textarea"

import { Select } from '../components/ui/Select';
import { MapPin, Phone, Mail, Clock } from '../components/icons';
import { useToast } from '../hooks/useToast';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 24px;
  
  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
`;

const Description = styled.p`
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled(motion.form)`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InfoCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--red-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
    color: var(--primary);
  }
`;

const InfoContent = styled.div`
  h3 {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 1.1rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

const MapContainer = styled(motion.div)`
  margin-top: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 400px;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const schema = yup.object({
  name: yup.string().required('الاسم مطلوب'),
  email: yup.string().email('يرجى إدخال بريد إلكتروني صالح').required('البريد الإلكتروني مطلوب'),
  phone: yup.string().matches(/^[0-9+\s-]{8,15}$/, 'يرجى إدخال رقم هاتف صالح'),
  subject: yup.string().required('الموضوع مطلوب'),
  message: yup.string().required('الرسالة مطلوبة').min(10, 'الرسالة قصيرة جدًا'),
});

export const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا', 'success');
      reset();
    } catch (error) {
      showToast('حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>تواصل معنا</Title>
        <Description>
          نحن هنا للإجابة على استفساراتك وتقديم المساعدة. يرجى ملء النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.
        </Description>
      </Header>
      
      <ContentWrapper>
        <ContactForm
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2>أرسل لنا رسالة</h2>
          
          <FormGroup>
            <Input
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <Input
              label="البريد الإلكتروني"
              placeholder="example@example.com"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </FormGroup>
          
          <FormGroup>
            <Input
              label="رقم الهاتف (اختياري)"
              placeholder="رقم الهاتف"
              {...register('phone')}
              error={errors.phone?.message}
            />
            
            <Select
              label="الموضوع"
              {...register('subject')}
              error={errors.subject?.message}
              options={[
                { value: '', label: 'اختر موضوعًا' },
                { value: 'inquiry', label: 'استفسار عام' },
                { value: 'order', label: 'استفسار عن طلب' },
                { value: 'custom', label: 'تصميم مخصص' },
                { value: 'feedback', label: 'اقتراحات وملاحظات' },
                { value: 'complaint', label: 'شكوى' },
              ]}
            />
          </FormGroup>
          
          <TextArea
            label="الرسالة"
            placeholder="اكتب رسالتك هنا..."
            rows={6}
            {...register('message')}
            error={errors.message?.message}
          />
          
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جارِ الإرسال...' : 'إرسال الرسالة'}
          </Button>
        </ContactForm>
        
        <div>
          <InfoContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InfoCard>
              <IconWrapper>
                <MapPin />
              </IconWrapper>
              <InfoContent>
                <h3>العنوان</h3>
                <p>15 شارع محمد فريد، وسط البلد، القاهرة، مصر</p>
              </InfoContent>
            </InfoCard>
            
            <InfoCard>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <InfoContent>
                <h3>اتصل بنا</h3>
                <p>هاتف: 0123456789 (02+)</p>
                <p>موبايل: 0100000000</p>
              </InfoContent>
            </InfoCard>
            
            <InfoCard>
              <IconWrapper>
                <Mail />
              </IconWrapper>
              <InfoContent>
                <h3>راسلنا</h3>
                <p>البريد الإلكتروني: info@tarzi.com</p>
                <p>الدعم الفني: support@tarzi.com</p>
              </InfoContent>
            </InfoCard>
            
            <InfoCard>
              <IconWrapper>
                <Clock />
              </IconWrapper>
              <InfoContent>
                <h3>ساعات العمل</h3>
                <p>أيام الأسبوع: 10:00 صباحًا - 10:00 مساءً</p>
                <p>الجمعة: 2:00 ظهرًا - 10:00 مساءً</p>
              </InfoContent>
            </InfoCard>
          </InfoContainer>
          
          <MapContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6741736323715!2d31.246406!3d30.044419999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnNDcuMSJF!5e0!3m2!1sen!2seg!4v1620120000000!5m2!1sen!2seg"
              title="موقع المتجر"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </MapContainer>
        </div>
      </ContentWrapper>
    </PageContainer>
  );
};