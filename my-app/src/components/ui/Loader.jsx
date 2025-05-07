// src/components/ui/Loader.jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: ${props => props.center ? 'center' : 'flex-start'};
  align-items: ${props => props.center ? 'center' : 'flex-start'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  padding: ${props => props.padding || '0'};
`;

const SpinnerWrapper = styled.div`
  width: ${props => {
    if (props.size === 'small') return '24px';
    if (props.size === 'large') return '48px';
    return '36px';
  }};
  height: ${props => {
    if (props.size === 'small') return '24px';
    if (props.size === 'large') return '48px';
    return '36px';
  }};
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: ${props => {
    if (props.size === 'small') return '2px';
    if (props.size === 'large') return '4px';
    return '3px';
  }} solid rgba(0, 0, 0, 0.1);
  border-top: ${props => {
    if (props.size === 'small') return '2px';
    if (props.size === 'large') return '4px';
    return '3px';
  }} solid var(--primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Loader = ({
  size = 'medium',
  center = false,
  fullWidth = false,
  fullHeight = false,
  padding = '20px 0',
}) => {
  return (
    <LoaderContainer center={center} fullWidth={fullWidth} fullHeight={fullHeight} padding={padding}>
      <SpinnerWrapper size={size}>
        <Spinner size={size} />
      </SpinnerWrapper>
    </LoaderContainer>
  );
};