// src/features/auth/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useLoginMutation } from '../api/authApi';
import { setCredentials } from '../store/authSlice';
import { EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../../../components/icons';

const PageContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  background-color: var(--grey-100);
`;

const FormContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
  
  @media (max-width: 992px) {
    flex: 0 0 100%;
  }
`;

const FormCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  padding: 40px;
  
  @media (max-width: 576px) {
    padding: 24px;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 16px;
`;

const FormTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
`;

const FormSubtitle = styled.p`
  color: var(--text-secondary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
    color: var(--grey-500);
    width: 20px;
    height: 20px;
    pointer-events: none;
  }
  
  input {
    padding-right: 48px;
  }
`;

const PasswordWrapper = styled(InputWrapper)`
  svg.toggle-password {
    left: 16px;
    right: auto;
    cursor: pointer;
    pointer-events: all;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error);
  font-size: 0.9rem;
  margin-top: 4px;
`;

const ForgotPassword = styled(Link)`
  font-size: 0.9rem;
  text-align: left;
  color: var(--primary);
  margin-top: -12px;
  display: block;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DividerText = styled.div`
  position: relative;
  text-align: center;
  margin: 24px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--border);
    z-index: 0;
  }
  
  span {
    position: relative;
    background-color: var(--white);
    padding: 0 16px;
    color: var(--text-secondary);
    font-size: 0.9rem;
    z-index: 1;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border-radius: 4px;
  background-color: ${props => props.bgcolor || 'var(--background)'};
  color: ${props => props.color || 'var(--text-primary)'};
  border: 1px solid var(--border);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: ${props => props.hoverBg || 'var(--grey-100)'};
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  svg {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
  
  a {
    color: var(--primary);
    font-weight: 500;
    margin-right: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ImageColumn = styled.div`
  flex: 1;
  background-image: url('/images/login-image.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
  }
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const ImageContent = styled.div`
  position: absolute;
  bottom: 48px;
  right: 48px;
  max-width: 400px;
  color: white;
  z-index: 1;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const schema = yup.object({
  email: yup.string()
    .email('يرجى إدخال بريد إلكتروني صالح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup.string()
    .required('كلمة المرور مطلوبة')
    .min(6, 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Get redirect path from URL params or default to home
  const from = location.state?.from?.pathname || '/';
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const [login] = useLoginMutation();
  
  const onSubmit = async (data) => {
    try {
      setLoginError('');
      const result = await login(data).unwrap();
      
      // Store the user's info in Redux
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
      }));
      
      // Navigate to the previous page or home
      navigate(from, { replace: true });
      
    } catch (err) {
      setLoginError(err.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <PageContainer>
      <FormContainer
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormCard>
          <FormHeader>
            <Logo>ترزي</Logo>
            <FormTitle>مرحبًا بعودتك</FormTitle>
            <FormSubtitle>سجل دخولك للوصول إلى حسابك</FormSubtitle>
          </FormHeader>
          
          {loginError && (
            <ErrorMessage style={{ marginBottom: '16px', textAlign: 'center' }}>
              {loginError}
            </ErrorMessage>
          )}
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
              <EmailIcon />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                {...register('email')}
                error={errors.email?.message}
              />
            </InputWrapper>
            
            <PasswordWrapper>
              <LockIcon />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                {...register('password')}
                error={errors.password?.message}
              />
              {showPassword ? (
                <EyeOffIcon 
                  className="toggle-password" 
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeIcon 
                  className="toggle-password" 
                  onClick={() => setShowPassword(true)}
                />
              )}
            </PasswordWrapper>
            
            <ForgotPassword to="/forgot-password">
              نسيت كلمة المرور؟
            </ForgotPassword>
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جارِ تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </Form>
          
          <DividerText>
            <span>أو</span>
          </DividerText>
          
          <SocialButtonsContainer>
            <SocialButton 
              bgcolor="#4267B2" 
              color="white"
              hoverBg="#365899"
            >
              فيسبوك
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
              </svg>
            </SocialButton>
            
            <SocialButton 
              bgcolor="#DB4437" 
              color="white"
              hoverBg="#C53829"
            >
              جوجل
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 12.151L12.545 15.047 16.433 15.047C16.147 16.0811 15.228 17.1186 12.545 17.1186 10.0763 17.1186 8.10897 15.1069 8.10897 12.5326 8.10897 9.95824 10.0763 7.9466 12.545 7.9466 13.9599 7.9466 14.9307 8.486 15.6003 9.11244L17.8761 6.96995C16.4367 5.64481 14.6658 4.81378 12.545 4.81378 8.20891 4.81378 4.82422 8.093 4.82422 12.5326 4.82422 16.9722 8.20891 20.2514 12.545 20.2514 17.1145 20.2514 19.6565 17.3249 19.6565 12.7266 19.6565 12.2205 19.6093 11.8086 19.5621 11.4909L12.545 11.4909 12.545 12.151z" />
              </svg>
            </SocialButton>
          </SocialButtonsContainer>
          
          <SignupPrompt>
            ليس لديك حساب؟
            <Link to="/register">إنشاء حساب</Link>
          </SignupPrompt>
        </FormCard>
      </FormContainer>
      
      <ImageColumn>
        <ImageContent>
          <h2>تألق بأناقة فريدة من نوعها</h2>
          <p>اكتشف مجموعتنا المميزة من البدل والقمصان المصممة خصيصًا لتناسب ذوقك الفريد وأسلوبك المميز.</p>
        </ImageContent>
      </ImageColumn>
    </PageContainer>
  );
};