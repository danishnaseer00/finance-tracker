import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaPalette, FaBell, FaShieldAlt, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const SettingsContainer = styled.div`
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  padding-left: 3.5rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding-left: 5.5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSize.md};
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 800px;
`;

const SettingCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.fontSize.lg};
`;

const SettingTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const SettingDescription = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSize.sm};
  margin-bottom: 1rem;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
`;

const SettingLabel = styled.label`
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) => props.theme.colors.border};
    transition: 0.4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${(props) => props.theme.colors.primary};
  }
  
  input:checked + span:before {
    transform: translateX(24px);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const InfoText = styled.div`
  color: ${(props) => props.theme.colors.textTertiary};
  font-size: ${(props) => props.theme.fontSize.sm};
  margin-top: 0.5rem;
`;

const Settings: React.FC = () => {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SettingsContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences and settings</PageSubtitle>
      </PageHeader>

      <SettingsGrid>
        {/* Profile Settings */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon>
              <FaUser />
            </SettingIcon>
            <SettingTitle>Profile Information</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Your personal information and account details
          </SettingDescription>
          <SettingRow>
            <div>
              <SettingLabel>Username</SettingLabel>
              <InfoText>{state.user?.username}</InfoText>
            </div>
          </SettingRow>
          <SettingRow>
            <div>
              <SettingLabel>Email</SettingLabel>
              <InfoText>{state.user?.email}</InfoText>
            </div>
          </SettingRow>
          <SettingRow>
            <div>
              <SettingLabel>Full Name</SettingLabel>
              <InfoText>
                {state.user?.first_name} {state.user?.last_name}
              </InfoText>
            </div>
          </SettingRow>
        </SettingCard>

        {/* Security Settings */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon>
              <FaLock />
            </SettingIcon>
            <SettingTitle>Security</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Manage your password and security preferences
          </SettingDescription>
          <SettingRow>
            <SettingLabel>Change Password</SettingLabel>
            <Button>Update</Button>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Two-Factor Authentication</SettingLabel>
            <Button>Enable</Button>
          </SettingRow>
        </SettingCard>

        {/* Notifications */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon>
              <FaBell />
            </SettingIcon>
            <SettingTitle>Notifications</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Control how you receive notifications
          </SettingDescription>
          <SettingRow>
            <SettingLabel>Push Notifications</SettingLabel>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Email Alerts</SettingLabel>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingRow>
        </SettingCard>

        {/* Appearance */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon>
              <FaPalette />
            </SettingIcon>
            <SettingTitle>Appearance</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Customize how Finance Tracker looks
          </SettingDescription>
          <SettingRow>
            <SettingLabel>Dark Mode</SettingLabel>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span></span>
            </ToggleSwitch>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Currency</SettingLabel>
            <InfoText>USD ($)</InfoText>
          </SettingRow>
        </SettingCard>

        {/* Data & Privacy */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon>
              <FaShieldAlt />
            </SettingIcon>
            <SettingTitle>Data & Privacy</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Manage your data and privacy settings
          </SettingDescription>
          <SettingRow>
            <SettingLabel>Export Data</SettingLabel>
            <Button>
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export
            </Button>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Delete Account</SettingLabel>
            <Button style={{ background: '#ef4444' }}>Delete</Button>
          </SettingRow>
        </SettingCard>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;