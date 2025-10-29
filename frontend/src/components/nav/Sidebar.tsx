import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaChartLine, FaExchangeAlt, FaList, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { darkTheme } from '../../themes/GlobalStyle';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => (props.$isOpen ? '250px' : '70px')};
  background: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  transition: width 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: ${(props) => (props.$isOpen ? '250px' : '0')};
    overflow-x: hidden;
  }
`;

const TopSection = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${(props) => props.theme.colors.textPrimary};
  
  h1 {
    font-size: ${(props) => props.theme.fontSize.lg};
    font-weight: 700;
    white-space: ${(props) => (props.$isOpen ? 'nowrap' : 'nowrap')};
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    width: ${(props) => (props.$isOpen ? 'auto' : '0')};
    transition: opacity 0.3s ease, width 0.3s ease;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.lg};
  cursor: pointer;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: ${(props) => 
    props.$isActive 
      ? props.theme.colors.primary 
      : props.theme.colors.textSecondary
  };
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 0.25rem 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  
  &:hover {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
  }
  
  ${(props) => props.$isActive && `
    background: rgba(59, 130, 246, 0.1);
    font-weight: 600;
  `}
`;

const BottomSection = styled.div`
  padding: 1rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.background};
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const UserInfo = styled.div<{ $isOpen: boolean }>`
  overflow: hidden;
  
  div:first-child {
    font-weight: 600;
    color: ${(props) => props.theme.colors.textPrimary};
    font-size: ${(props) => props.theme.fontSize.sm};
    white-space: ${(props) => (props.$isOpen ? 'nowrap' : 'nowrap')};
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  div:last-child {
    font-size: ${(props) => props.theme.fontSize.xs};
    color: ${(props) => props.theme.colors.textTertiary};
    white-space: ${(props) => (props.$isOpen ? 'nowrap' : 'nowrap')};
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  width: ${(props) => (props.$isOpen ? 'auto' : '0')};
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { state, logout } = useAuth();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const userInitials = state.user 
    ? `${state.user.first_name?.charAt(0) || ''}${state.user.last_name?.charAt(0) || ''}`.toUpperCase()
    : '?';

  // For mobile, close sidebar when clicking on a menu item
  const handleMenuItemClick = () => {
    if (window.innerWidth < parseInt(darkTheme.breakpoints.md)) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen}>
        <TopSection>
          <Logo $isOpen={isOpen}>
            <FaWallet style={{ color: darkTheme.colors.primary }} />
            {isOpen && <h1>FinanceTracker</h1>}
          </Logo>
        </TopSection>
        
        <NavMenu>
          <NavItem 
            to="/dashboard" 
            $isActive={location.pathname === '/dashboard'}
            onClick={handleMenuItemClick}
          >
            <FaChartLine />
            {isOpen && <span>Dashboard</span>}
          </NavItem>
          <NavItem 
            to="/accounts" 
            $isActive={location.pathname === '/accounts'}
            onClick={handleMenuItemClick}
          >
            <FaWallet />
            {isOpen && <span>Accounts</span>}
          </NavItem>
          <NavItem 
            to="/transactions" 
            $isActive={location.pathname === '/transactions'}
            onClick={handleMenuItemClick}
          >
            <FaExchangeAlt />
            {isOpen && <span>Transactions</span>}
          </NavItem>
          <NavItem 
            to="/budgets" 
            $isActive={location.pathname === '/budgets'}
            onClick={handleMenuItemClick}
          >
            <FaList />
            {isOpen && <span>Budgets</span>}
          </NavItem>
          <NavItem 
            to="/settings" 
            $isActive={location.pathname === '/settings'}
            onClick={handleMenuItemClick}
          >
            <FaCog />
            {isOpen && <span>Settings</span>}
          </NavItem>
        </NavMenu>
        
        <BottomSection>
          <UserSection>
            <UserAvatar>{userInitials}</UserAvatar>
            <UserInfo $isOpen={isOpen}>
              <div>{state.user?.first_name || state.user?.username}</div>
              <div>{state.user?.email}</div>
            </UserInfo>
          </UserSection>
          
          <NavItem 
            to="#" 
            $isActive={false}
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <FaSignOutAlt />
            {isOpen && <span>Logout</span>}
          </NavItem>

          <ToggleButton onClick={toggleSidebar} style={{ display: 'block', margin: '0 auto' }}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </ToggleButton>
        </BottomSection>
      </SidebarContainer>
      
      {/* Overlay for mobile */}
      {isOpen && window.innerWidth < parseInt(darkTheme.breakpoints.md) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 250, // width of sidebar
            width: `calc(100% - 250px)`,
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: isOpen ? 'block' : 'none'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;