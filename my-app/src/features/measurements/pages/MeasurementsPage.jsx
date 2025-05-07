// src/features/measurements/pages/MeasurementsPage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Loader } from '../../../components/ui/Loader';
import { useToast } from '../../../hooks/useToast';
import { 
  useGetUserMeasurementsQuery, 
  useAddMeasurementMutation,
  useUpdateMeasurementMutation 
} from '../api/measurementsApi';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
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

const FormContainer = styled.div`
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--white)' : 'var(--text-primary)'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'var(--grey-100)'};
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormFooter = styled.div`
  grid-column: 1 / -1;
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

const InfoBox = styled.div`
  background-color: var(--grey-100);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-right: 3px solid var(--primary);
`;

// Schema validation
const schema = yup.object({
  name: yup.string().required('اسم القياس مطلوب'),
  gender: yup.string().required('الجنس مطلوب'),
  height: yup.number()
    .typeError('يجب أن يكون الطول رقمًا')
    .positive('يجب أن يكون الطول رقمًا موجبًا')
    .required('الطول مطلوب'),
  weight: yup.number()
    .typeError('يجب أن يكون الوزن رقمًا')
    .positive('يجب أن يكون الوزن رقمًا موجبًا')
    .required('الوزن مطلوب'),
  chest: yup.number()
    .typeError('يجب أن يكون محيط الصدر رقمًا')
    .positive('يجب أن يكون محيط الصدر رقمًا موجبًا')
    .required('محيط الصدر مطلوب'),
  waist: yup.number()
    .typeError('يجب أن يكون محيط الخصر رقمًا')
    .positive('يجب أن يكون محيط الخصر رقمًا موجبًا')
    .required('محيط الخصر مطلوب'),
  hips: yup.number()
    .typeError('يجب أن يكون محيط الورك رقمًا')
    .positive('يجب أن يكون محيط الورك رقمًا موجبًا')
    .required('محيط الورك مطلوب'),
  shoulder: yup.number()
    .typeError('يجب أن يكون عرض الكتف رقمًا')
    .positive('يجب أن يكون عرض الكتف رقمًا موجبًا')
    .required('عرض الكتف مطلوب'),
  sleeve: yup.number()
    .typeError('يجب أن يكون طول الكم رقمًا')
    .positive('يجب أن يكون طول الكم رقمًا موجبًا')
    .required('طول الكم مطلوب'),
  inseam: yup.number()
    .typeError('يجب أن يكون طول الساق الداخلي رقمًا')
    .positive('يجب أن يكون طول الساق الداخلي رقمًا موجبًا')
    .required('طول الساق الداخلي مطلوب'),
});

export const MeasurementsPage = () => {
  const [activeTab, setActiveTab] = useState('measurements');
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState(null);
  
  const {
    data: measurementsData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetUserMeasurementsQuery();
  
  const [addMeasurement, { isLoading: isAdding }] = useAddMeasurementMutation();
  const [updateMeasurement, { isLoading: isUpdating }] = useUpdateMeasurementMutation();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
    setValue 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      gender: 'male',
      height: '',
      weight: '',
      chest: '',
      waist: '',
      hips: '',
      shoulder: '',
      sleeve: '',
      inseam: ''
    }
  });
  
  // Load measurement data if editing
  useEffect(() => {
    if (editingId && measurementsData) {
      const measurement = measurementsData.find(m => m._id === editingId);
      if (measurement) {
        setValue('name', measurement.name);
        setValue('gender', measurement.gender);
        setValue('height', measurement.height);
        setValue('weight', measurement.weight);
        setValue('chest', measurement.chest);
        setValue('waist', measurement.waist);
        setValue('hips', measurement.hips);
        setValue('shoulder', measurement.shoulder);
        setValue('sleeve', measurement.sleeve);
        setValue('inseam', measurement.inseam);
      }
    }
  }, [editingId, measurementsData, setValue]);
  
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateMeasurement({ id: editingId, data }).unwrap();
        showToast('تم تحديث القياسات بنجاح', 'success');
        setEditingId(null);
      } else {
        await addMeasurement(data).unwrap();
        showToast('تم إضافة القياسات بنجاح', 'success');
      }
      
      reset();
      refetch();
    } catch (err) {
      showToast(
        err.data?.message || 'حدث خطأ أثناء حفظ القياسات', 
        'error'
      );
    }
  };
  
  const handleEdit = (id) => {
    setEditingId(id);
    setActiveTab('measurements');
  };
  
  const handleCancel = () => {
    setEditingId(null);
    reset();
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <Loader size="large" center />
      </PageContainer>
    );
  }
  
  if (isError) {
    return (
      <PageContainer>
        <div>
          <Title>حدث خطأ</Title>
          <p>{error?.data?.message || 'حدث خطأ أثناء تحميل القياسات'}</p>
          <Button 
            variant="primary" 
            onClick={refetch}
            style={{ marginTop: '16px' }}
          >
            إعادة المحاولة
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>قياساتي</Title>
        <Description>
          أدخل قياساتك الدقيقة للحصول على ملابس مخصصة تناسب جسمك تمامًا.
        </Description>
      </Header>
      
      <FormContainer>
        <TabsContainer>
          <Tab 
            active={activeTab === 'measurements'} 
            onClick={() => setActiveTab('measurements')}
          >
            إضافة قياسات
          </Tab>
          <Tab 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')}
          >
            القياسات المحفوظة
          </Tab>
          <Tab 
            active={activeTab === 'guide'} 
            onClick={() => setActiveTab('guide')}
          >
            دليل القياس
          </Tab>
        </TabsContainer>
        
        {activeTab === 'measurements' && (
          <>
            <InfoBox>
              جميع القياسات بالسنتيمتر. يرجى قياس جسمك بدقة للحصول على أفضل نتيجة.
            </InfoBox>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="اسم القياس (مثال: قياساتي الشخصية)"
                {...register('name')}
                error={errors.name?.message}
              />
              
              <Select
                label="الجنس"
                {...register('gender')}
                error={errors.gender?.message}
                options={[
                  { value: 'male', label: 'ذكر' },
                  { value: 'female', label: 'أنثى' }
                ]}
              />
              
              <Input
                label="الطول (سم)"
                type="number"
                {...register('height')}
                error={errors.height?.message}
              />
              
              <Input
                label="الوزن (كجم)"
                type="number"
                {...register('weight')}
                error={errors.weight?.message}
              />
              
              <Input
                label="محيط الصدر (سم)"
                type="number"
                {...register('chest')}
                error={errors.chest?.message}
              />
              
              <Input
                label="محيط الخصر (سم)"
                type="number"
                {...register('waist')}
                error={errors.waist?.message}
              />
              
              <Input
                label="محيط الورك (سم)"
                type="number"
                {...register('hips')}
                error={errors.hips?.message}
              />
              
              <Input
                label="عرض الكتف (سم)"
                type="number"
                {...register('shoulder')}
                error={errors.shoulder?.message}
              />
              
              <Input
                label="طول الكم (سم)"
                type="number"
                {...register('sleeve')}
                error={errors.sleeve?.message}
              />
              
              <Input
                label="طول الساق الداخلي (سم)"
                type="number"
                {...register('inseam')}
                error={errors.inseam?.message}
              />
              
              <FormFooter>
                {editingId && (
                  <Button 
                    variant="outline"
                    onClick={handleCancel}
                    style={{ marginLeft: '12px' }}
                  >
                    إلغاء
                  </Button>
                )}
                
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isAdding || isUpdating}
                >
                  {isAdding || isUpdating 
                    ? 'جارٍ الحفظ...' 
                    : editingId ? 'تحديث القياسات' : 'حفظ القياسات'
                  }
                </Button>
              </FormFooter>
            </Form>
          </>
        )}
        
        {activeTab === 'saved' && (
          <div>
            {measurementsData && measurementsData.length > 0 ? (
              measurementsData.map(measurement => (
                <div 
                  key={measurement._id}
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <h3>{measurement.name}</h3>
                    <div>
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => handleEdit(measurement._id)}
                        style={{ marginLeft: '8px' }}
                      >
                        تعديل
                      </Button>
                      <Button 
                        variant="black" 
                        size="small"
                      >
                        استخدام
                      </Button>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px'
                  }}>
                    <div>الجنس: {measurement.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                    <div>الطول: {measurement.height} سم</div>
                    <div>الوزن: {measurement.weight} كجم</div>
                    <div>محيط الصدر: {measurement.chest} سم</div>
                    <div>محيط الخصر: {measurement.waist} سم</div>
                    <div>محيط الورك: {measurement.hips} سم</div>
                    <div>عرض الكتف: {measurement.shoulder} سم</div>
                    <div>طول الكم: {measurement.sleeve} سم</div>
                    <div>طول الساق الداخلي: {measurement.inseam} سم</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p>لا توجد قياسات محفوظة حتى الآن</p>
                <Button 
                  variant="primary"
                  onClick={() => setActiveTab('measurements')}
                  style={{ marginTop: '16px' }}
                >
                  إضافة قياس جديد
                </Button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'guide' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>كيفية أخذ القياسات بشكل صحيح</h3>
            
            <p style={{ marginBottom: '24px' }}>
              للحصول على أفضل نتائج، استخدم شريط قياس الخياطة وقف بشكل مستقيم أثناء أخذ القياسات. يفضل أن يساعدك شخص آخر.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>محيط الصدر</h4>
              <p>قم بقياس الجزء الأكبر من الصدر مع وضع الشريط أفقيًا تحت الإبطين وحول منطقة الظهر.</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>محيط الخصر</h4>
              <p>قم بقياس أضيق جزء من الخصر، عادة حول السرة.</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>محيط الورك</h4>
              <p>قم بقياس أوسع جزء من الوركين، مع مرور الشريط حول الأرداف.</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>عرض الكتف</h4>
              <p>قم بقياس المسافة من نقطة التقاء الكتف بالذراع من جهة إلى الجهة الأخرى.</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>طول الكم</h4>
              <p>قم بقياس المسافة من نقطة التقاء الكتف بالذراع إلى معصم اليد.</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <h4>طول الساق الداخلي</h4>
              <p>قم بقياس المسافة من أعلى الفخذ الداخلي إلى أسفل الكاحل.</p>
            </div>
          </div>
        )}
      </FormContainer>
    </PageContainer>
  );
};