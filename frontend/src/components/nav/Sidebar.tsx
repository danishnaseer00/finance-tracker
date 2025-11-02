import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWallet, FaChartLine, FaExchangeAlt, FaList, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { darkTheme } from '../../themes/GlobalStyle';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? '0' : '-250px')};
  height: 100vh;
  width: 250px;
  background: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  transition: left 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    left: ${(props) => (props.$isOpen ? '0' : '-250px')};
  }
`;

const TopSection = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
`;

const Logo = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${(props) => props.theme.colors.textPrimary};
  overflow: hidden;
  
  svg {
    min-width: 24px;
    flex-shrink: 0;
  }
  
  h1 {
    font-size: ${(props) => props.theme.fontSize.lg};
    font-weight: 700;
    white-space: nowrap;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  }
`;

const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  top: 12px;
  left: ${(props) => (props.$isOpen ? '260px' : '12px')};
  background: ${(props) => props.theme.colors.primary};
  border: none;
  color: white;
  font-size: ${(props) => props.theme.fontSize.lg};
  cursor: pointer;
  padding: 0.75rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius.md};
  z-index: 1002;
  transition: left 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }

  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    left: 12px;
    top: 12px;
  }
`;

const NavMenu = styled.nav`
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
`;

const NavItem = styled(Link)<{ $isActive: boolean; $isOpen?: boolean }>`
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
  white-space: nowrap;
  
  svg {
    min-width: 20px;
    flex-shrink: 0;
  }
  
  span {
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
    display: ${(props) => (props.$isOpen ? 'inline' : 'none')};
  }
  
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

const UserSection = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.background};
  margin-bottom: 1rem;
  overflow: hidden;
`;

const UserAvatar = styled.div`
  min-width: 40px;
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
  flex-shrink: 0;
`;

const UserInfo = styled.div<{ $isOpen: boolean }>`
  overflow: hidden;
  flex: 1;
  
  div:first-child {
    font-weight: 600;
    color: ${(props) => props.theme.colors.textPrimary};
    font-size: ${(props) => props.theme.fontSize.sm};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  div:last-child {
    font-size: ${(props) => props.theme.fontSize.xs};
    color: ${(props) => props.theme.colors.textTertiary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  transition: opacity 0.3s ease;
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { state, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const userInitials = state.user 
    ? `${state.user.first_name?.charAt(0) || ''}${state.user.last_name?.charAt(0) || ''}`.toUpperCase()
    : '?';

  const handleMenuItemClick = (path: string) => {
    // Always close sidebar after clicking a menu item
    setIsOpen(false);
    
    // Small delay to allow animation to complete before navigation
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} $isOpen={isOpen}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>
      
      <MobileOverlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <SidebarContainer $isOpen={isOpen}>
        <TopSection>
          <Logo $isOpen={isOpen}>
            <FaWallet style={{ color: darkTheme.colors.primary }} />
            {isOpen && <h1>Fintrack</h1>}
          </Logo>
        </TopSection>
        
        <NavMenu>
          <NavItem 
            to="/dashboard" 
            $isActive={location.pathname === '/dashboard'}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleMenuItemClick('/dashboard');
            }}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </NavItem>
          <NavItem 
            to="/accounts" 
            $isActive={location.pathname === '/accounts'}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleMenuItemClick('/accounts');
            }}
          >
            <FaWallet />
            <span>Accounts</span>
          </NavItem>
          <NavItem 
            to="/transactions" 
            $isActive={location.pathname === '/transactions'}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleMenuItemClick('/transactions');
            }}
          >
            <FaExchangeAlt />
            <span>Transactions</span>
          </NavItem>
          <NavItem 
            to="/budgets" 
            $isActive={location.pathname === '/budgets'}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleMenuItemClick('/budgets');
            }}
          >
            <FaList />
            <span>Budgets</span>
          </NavItem>
          <NavItem 
            to="/settings" 
            $isActive={location.pathname === '/settings'}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleMenuItemClick('/settings');
            }}
          >
            <FaCog />
            <span>Settings</span>
          </NavItem>
        </NavMenu>
        
        <BottomSection>
          <UserSection $isOpen={isOpen}>
            <UserAvatar>{userInitials}</UserAvatar>
            {isOpen && (
              <UserInfo $isOpen={isOpen}>
                <div>{state.user?.first_name || state.user?.username}</div>
                <div>{state.user?.email}</div>
              </UserInfo>
            )}
          </UserSection>
          
          <NavItem 
            to="#" 
            $isActive={false}
            $isOpen={isOpen}
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </NavItem>
        </BottomSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;