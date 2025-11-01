import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaPalette, FaBell, FaShieldAlt, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { settingsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

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

const Input = styled.input`
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
  width: 100%;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background: #ef4444;
  
  &:hover {
    background: #dc2626;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const InfoText = styled.div`
  color: ${(props) => props.theme.colors.textTertiary};
  font-size: ${(props) => props.theme.fontSize.sm};
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  color: #10b981;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: 1rem;
`;

const Settings: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      await settingsAPI.changePassword(oldPassword, newPassword);
      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.response?.data?.detail || 'Failed to change password');
    }
  };

  const handleExportData = async () => {
    try {
      const response = await settingsAPI.exportData();
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm deletion');
      return;
    }

    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );

    if (!confirmed) return;

    try {
      await settingsAPI.deleteAccount(deletePassword);
      alert('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error: any) {
      setDeleteError(error.response?.data?.detail || 'Failed to delete account');
    }
  };

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
            <SettingTitle>Change Password</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Update your password to keep your account secure
          </SettingDescription>

          {passwordMessage && <SuccessMessage>{passwordMessage}</SuccessMessage>}
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

          <form onSubmit={handleChangePassword}>
            <FormGroup>
              <SettingLabel>Current Password</SettingLabel>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <SettingLabel>New Password</SettingLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <SettingLabel>Confirm New Password</SettingLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button type="submit">Update Password</Button>
          </form>
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
            <SettingLabel>Theme</SettingLabel>
            <InfoText>Dark Mode (Active)</InfoText>
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
            <Button onClick={handleExportData}>
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export
            </Button>
          </SettingRow>
        </SettingCard>

        {/* Delete Account */}
        <SettingCard>
          <SettingHeader>
            <SettingIcon style={{ color: '#ef4444' }}>
              <FaShieldAlt />
            </SettingIcon>
            <SettingTitle style={{ color: '#ef4444' }}>Danger Zone</SettingTitle>
          </SettingHeader>
          <SettingDescription>
            Permanently delete your account and all associated data
          </SettingDescription>

          {deleteError && <ErrorMessage>{deleteError}</ErrorMessage>}

          <FormGroup>
            <SettingLabel>Enter your password to confirm deletion</SettingLabel>
            <Input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter password"
            />
            <InfoText>
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </InfoText>
          </FormGroup>
          <DangerButton onClick={handleDeleteAccount}>
            Delete Account
          </DangerButton>
        </SettingCard>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings;