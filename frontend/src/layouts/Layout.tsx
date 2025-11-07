import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/nav/Sidebar';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) => props.theme.colors.background};
`;

const MainContent = styled.main<{ $isOpen: boolean }>`
  flex: 1;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
  margin-left: ${(props) => (props.$isOpen ? '250px' : '0')};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AppContainer>
      <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />
      <MainContent $isOpen={sidebarOpen}>
        {children}
      </MainContent>
    </AppContainer>
  );
};

export default Layout;
