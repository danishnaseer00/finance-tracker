import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/nav/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 70px; /* Default sidebar width */
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;