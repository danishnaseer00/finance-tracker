import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AccountForm from '../../components/AccountForm.tsx';
import { accountAPI } from '../../services/api';

const AccountsContainer = styled.div`
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  margin-left: 70px; /* Account for sidebar */
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const AccountCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const AccountHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AccountName = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const AccountType = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.textTertiary};
  background: ${(props) => props.theme.colors.background};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
`;

const BalanceContainer = styled.div`
  margin: 1.5rem 0;
`;

const BalanceLabel = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const BalanceValue = styled.div`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  font-weight: 700;
  color: ${(props) => props.theme.colors.textPrimary};
`;

const Currency = styled.span`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.textTertiary};
  margin-right: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textTertiary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const AddAccountCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: rgba(59, 130, 246, 0.05);
  }
`;

const AddAccountText = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 1rem;
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
        // Update existing account
        await accountAPI.updateAccount(editingAccount.id, data);
      } else {
        // Create new account
        await accountAPI.createAccount(data);
      }
      
      // Refresh the accounts list
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
        // Refresh the accounts list
        await fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const toggleBalanceVisibility = (id: number) => {
    console.log('Toggling balance visibility for account:', id);
  };

  if (loading) {
    return (
      <AccountsContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          Loading accounts...
        </div>
      </AccountsContainer>
    );
  }

  return (
    <AccountsContainer>
      <PageHeader>
        <PageTitle>Accounts</PageTitle>
        <Button onClick={handleAddAccount}>
          <FaPlus /> Add Account
        </Button>
      </PageHeader>

      <CardGrid>
        {accounts.map((account) => (
          <AccountCard key={account.account_id}>
            <AccountHeader>
              <AccountName>{account.account_name}</AccountName>
              <AccountType>{account.account_type.replace('_', ' ').toUpperCase()}</AccountType>
            </AccountHeader>
            
            <BalanceContainer>
              <BalanceLabel>Current Balance</BalanceLabel>
              <BalanceValue>
                <Currency>{account.currency}</Currency>
                {Math.abs(account.balance).toFixed(2)}
              </BalanceValue>
            </BalanceContainer>
            
            <Actions>
              <ActionButton onClick={() => toggleBalanceVisibility(account.account_id)}>
                <FaEye />
              </ActionButton>
              <ActionButton onClick={() => handleEditAccount(account)}>
                <FaEdit />
              </ActionButton>
              <ActionButton onClick={() => handleDeleteAccount(account.account_id)}>
                <FaTrash />
              </ActionButton>
            </Actions>
          </AccountCard>
        ))}
        
        <AddAccountCard onClick={handleAddAccount}>
          <FaPlus style={{ fontSize: '2rem', color: 'var(--primary-color)' }} />
          <AddAccountText>Add New Account</AddAccountText>
        </AddAccountCard>
      </CardGrid>

      <AccountForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAccount}
      />
    </AccountsContainer>
  );
};

export default Accounts;