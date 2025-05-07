import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LogoWrapper = styled(Link)`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${(props) => (props.light ? 'var(--white)' : 'var(--primary)')};
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${(props) => (props.light ? 'var(--primary-light)' : 'var(--primary-dark)')};
  }
`;

export const Logo = ({ light, ...props }) => {
  return (
    <LogoWrapper to="/" light={light} {...props}>
      ترزي
    </LogoWrapper>
  );
};