import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaWallet, FaChartLine, FaExchangeAlt, FaList, FaCog, FaSignOutAlt, FaTimes, FaBars } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${(props) => (props.$isOpen ? '0' : '-280px')};
  height: 100vh;
  width: 280px;
  background: ${(props) => props.theme.colors.background};
  box-shadow: ${(props) => props.$isOpen ? props.theme.shadows.neumorphic : 'none'};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 260px;
    left: ${(props) => (props.$isOpen ? '0' : '-260px')};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  
  svg {
    font-size: 1.5rem;
    filter: drop-shadow(0 0 5px ${(props) => props.theme.colors.primary}80);
  }
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${(props) => props.theme.colors.textPrimary};
    letter-spacing: 1px;
  }
`;

const NavMenu = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-right: 0.5rem; /* For scrollbar */
`;

const NavItem = styled(Link) <{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: ${(props) =>
    props.$isActive
      ? props.theme.colors.primary
      : props.theme.colors.textSecondary
  };
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  
  background: ${(props) => props.$isActive ? props.theme.colors.background : 'transparent'};
  box-shadow: ${(props) => props.$isActive ? props.theme.shadows.neumorphicInset : 'none'};
  
  svg {
    font-size: 1.2rem;
  }
  
  span {
    font-weight: ${(props) => props.$isActive ? '600' : '500'};
  }
  
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    transform: ${(props) => props.$isActive ? 'none' : 'translateX(5px)'};
  }
`;

const UserSection = styled.div`
  margin-top: auto;
  padding: 1.5rem;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  background: ${(props) => props.theme.colors.background};
  box-shadow: ${(props) => props.theme.shadows.neumorphic};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.background};
  box-shadow: ${(props) => props.theme.shadows.neumorphic};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
  font-size: 1.1rem;
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
  
  div:first-child {
    font-weight: 600;
    color: ${(props) => props.theme.colors.textPrimary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  div:last-child {
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  color: ${(props) => props.theme.colors.danger};
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => props.theme.colors.background};
    box-shadow: ${(props) => props.theme.shadows.neumorphic};
    transform: scale(1.1);
  }
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
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    z-index: 999;
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1100;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.background};
  box-shadow: ${(props) => props.theme.shadows.neumorphic};
  color: ${(props) => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    transform: scale(1.05);
  }
  
  &:active {
    box-shadow: ${(props) => props.theme.shadows.neumorphicInset};
    transform: scale(0.95);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    display: none; /* Hide on desktop as sidebar is always visible there usually, but for now let's keep it controlled by layout */
  }
`;

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setOpen }) => {
  const { state, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userInitials = state.user
    ? `${state.user.first_name?.charAt(0) || ''}${state.user.last_name?.charAt(0) || ''}`.toUpperCase()
    : '?';

  const handleMenuItemClick = (path: string) => {
    if (window.innerWidth <= 768) {
      setOpen(false);
    }
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <MobileOverlay $isOpen={isOpen} onClick={() => setOpen(false)} />

      {/* Mobile Toggle Button - Only visible on mobile when sidebar is closed */}
      {!isOpen && (
        <ToggleButton onClick={() => setOpen(true)}>
          <FaBars />
        </ToggleButton>
      )}

      <SidebarContainer $isOpen={isOpen}>
        <Logo>
          <FaWallet />
          <h1>Fintrack</h1>
          {/* Close button for mobile inside sidebar */}
          <div style={{ marginLeft: 'auto', cursor: 'pointer', display: window.innerWidth <= 768 ? 'block' : 'none' }} onClick={() => setOpen(false)}>
            <FaTimes />
          </div>
        </Logo>

        <NavMenu>
          {[
            { path: '/dashboard', icon: FaChartLine, label: 'Dashboard' },
            { path: '/accounts', icon: FaWallet, label: 'Accounts' },
            { path: '/transactions', icon: FaExchangeAlt, label: 'Transactions' },
            { path: '/budgets', icon: FaList, label: 'Budgets' },
            { path: '/settings', icon: FaCog, label: 'Settings' },
          ].map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path}
              onClick={(e) => {
                e.preventDefault();
                handleMenuItemClick(item.path);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavItem>
          ))}
        </NavMenu>

        <UserSection>
          <UserAvatar>{userInitials}</UserAvatar>
          <UserInfo>
            <div>{state.user?.first_name || state.user?.username}</div>
            <div>{state.user?.email}</div>
          </UserInfo>
          <LogoutButton onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </LogoutButton>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;