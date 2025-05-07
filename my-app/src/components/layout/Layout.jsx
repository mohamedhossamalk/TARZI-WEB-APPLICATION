// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';

const Main = styled.main`
  min-height: calc(100vh - 150px); /* header + footer height */
`;

export const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
};