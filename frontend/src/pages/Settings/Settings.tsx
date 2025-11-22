import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaLock, FaPalette, FaShieldAlt, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { settingsAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleSection = styled.div`
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: ${props => props.theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SettingIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`;

const SettingTitle = styled.h3`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const SettingDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.95rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.div`
  color: ${props => props.theme.colors.textTertiary};
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.success};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.danger};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  font-size: 0.9rem;
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
    <div>
      <HeaderSection>
        <TitleSection>
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </TitleSection>
      </HeaderSection>

      <SettingsGrid>
        {/* Profile Settings */}
        <Card>
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
              <SettingLabel style={{ marginBottom: 0 }}>Username</SettingLabel>
              <InfoText>{state.user?.username}</InfoText>
            </div>
          </SettingRow>
          <SettingRow>
            <div>
              <SettingLabel style={{ marginBottom: 0 }}>Email</SettingLabel>
              <InfoText>{state.user?.email}</InfoText>
            </div>
          </SettingRow>
          <SettingRow>
            <div>
              <SettingLabel style={{ marginBottom: 0 }}>Full Name</SettingLabel>
              <InfoText>
                {state.user?.first_name} {state.user?.last_name}
              </InfoText>
            </div>
          </SettingRow>
        </Card>

        {/* Security Settings */}
        <Card>
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
            <Button type="submit" variant="primary">Update Password</Button>
          </form>
        </Card>

        {/* Appearance */}
        <Card>
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
            <SettingLabel style={{ marginBottom: 0 }}>Theme</SettingLabel>
            <InfoText>Dark Mode (Active)</InfoText>
          </SettingRow>
          <SettingRow>
            <SettingLabel style={{ marginBottom: 0 }}>Currency</SettingLabel>
            <InfoText>USD ($)</InfoText>
          </SettingRow>
        </Card>

        {/* Data & Privacy */}
        <Card>
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
            <SettingLabel style={{ marginBottom: 0 }}>Export Data</SettingLabel>
            <Button onClick={handleExportData} variant="secondary" size="sm">
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export
            </Button>
          </SettingRow>
        </Card>

        {/* Delete Account */}
        <Card>
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
            <InfoText style={{ marginTop: '0.5rem', color: '#ef4444' }}>
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </InfoText>
          </FormGroup>
          <Button onClick={handleDeleteAccount} variant="danger">
            Delete Account
          </Button>
        </Card>
      </SettingsGrid>
    </div>
  );
};

export default Settings;