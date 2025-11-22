import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './nav/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main<{ $isSidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.$isSidebarOpen ? '280px' : '0'};
  padding: 2rem;
  transition: margin-left 0.3s ease;
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4rem; /* Space for the mobile toggle button */
  }
`;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Auto-close sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <LayoutContainer>
            <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <MainContent $isSidebarOpen={isSidebarOpen}>
                {children}
            </MainContent>
        </LayoutContainer>
    );
};

export default Layout;
