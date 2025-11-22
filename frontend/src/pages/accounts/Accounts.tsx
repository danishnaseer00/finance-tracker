import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaWallet, FaEdit, FaTrash } from 'react-icons/fa';
import AccountForm from '../../components/AccountForm.tsx';
import { accountAPI } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button, IconButton } from '../../components/ui/Button';

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
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const AccountCardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const AccountIcon = styled.div`
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

const AccountTypeBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  box-shadow: ${props => props.theme.shadows.neumorphic};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const BalanceSection = styled.div`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const BalanceLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const BalanceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  
  span {
    font-size: 1rem;
    color: ${props => props.theme.colors.textTertiary};
    font-weight: 500;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const AddAccountCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  cursor: pointer;
  border: 2px dashed ${props => props.theme.colors.border};
  background: transparent;
  box-shadow: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.surface}40;
    transform: translateY(-5px);
  }

  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.textTertiary};
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }

  span {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.colors.textSecondary};
  }

  &:hover svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Accounts: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingAccount) {
        await accountAPI.updateAccount(editingAccount.account_id, data);
      } else {
        await accountAPI.createAccount(data);
      }
      await fetchAccounts();
      setIsFormOpen(false);
      setEditingAccount(null);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.deleteAccount(id);
        await fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading accounts...
      </div>
    );
  }

  return (
    <div>
      <HeaderSection>
        <TitleSection>
          <h1>Accounts</h1>
        </TitleSection>
        <Button variant="primary" onClick={handleAddAccount}>
          <FaPlus /> Add Account
        </Button>
      </HeaderSection>

      <CardGrid>
        {accounts.map((account) => (
          <Card key={account.account_id}>
            <AccountCardContent>
              <AccountHeader>
                <AccountIcon>
                  <FaWallet />
                </AccountIcon>
                <AccountTypeBadge>
                  {account.account_type.replace('_', ' ')}
                </AccountTypeBadge>
              </AccountHeader>

              <BalanceSection>
                <BalanceLabel>{account.account_name}</BalanceLabel>
                <BalanceValue>
                  <span>{account.currency}</span>
                  {Math.abs(account.balance).toFixed(2)}
                </BalanceValue>
              </BalanceSection>

              <ActionButtons>
                <IconButton size="sm" onClick={() => handleEditAccount(account)}>
                  <FaEdit />
                </IconButton>
                <IconButton size="sm" variant="danger" onClick={() => handleDeleteAccount(account.account_id)}>
                  <FaTrash />
                </IconButton>
              </ActionButtons>
            </AccountCardContent>
          </Card>
        ))}

        <AddAccountCard onClick={handleAddAccount}>
          <FaPlus />
          <span>Add New Account</span>
        </AddAccountCard>
      </CardGrid>

      <AccountForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAccount}
      />
    </div>
  );
};

export default Accounts;