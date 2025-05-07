// src/components/ui/ErrorMessage.jsx
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  border-right: 3px solid var(--error);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h3`
  color: var(--error);
  font-weight: 600;
  margin-bottom: 8px;
`;

const Message = styled.p`
  color: var(--text-primary);
  margin-bottom: 16px;
`;

const RetryButton = styled.button`
  background-color: var(--error);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

export const ErrorMessage = ({ title = 'خطأ', message, retry }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {retry && (
        <RetryButton onClick={retry}>
          إعادة المحاولة
        </RetryButton>
      )}
    </Container>
  );
};