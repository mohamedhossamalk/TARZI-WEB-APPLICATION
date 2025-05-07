// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 10rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 16px 0;
  color: var(--text-primary);
  
  @media (max-width: 576px) {
    font-size: 1.75rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

export const NotFoundPage = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>الصفحة غير موجودة</Title>
      <Description>
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها أو إزالتها.
      </Description>
      <ButtonGroup>
        <Button variant="primary" as={Link} to="/">
          العودة للصفحة الرئيسية
        </Button>
        <Button variant="outline" as={Link} to="/products">
          تصفح المنتجات
        </Button>
      </ButtonGroup>
    </Container>
  );
};