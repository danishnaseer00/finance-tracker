import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import TransactionForm from '../../components/TransactionForm.tsx';
import { transactionAPI } from '../../services/api';

const TransactionsContainer = styled.div`
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

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
  width: 250px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textTertiary};
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

const FilterButton = styled.button`
  padding: 0.75rem;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const TableContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    min-width: 600px;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.sm};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:hover {
    background: rgba(59, 130, 246, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textTertiary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-right: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }

  &:last-child {
    margin-right: 0;
  }
`;

const AmountCell = styled(TableCell)<{ type: string }>`
  color: ${(props) => 
    props.type === 'income' 
      ? props.theme.colors.success 
      : props.theme.colors.danger
  };
  font-weight: 600;
`;

const Transactions: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        await transactionAPI.updateTransaction(editingTransaction.transaction_id, data);
      } else {
        // Create new transaction
        await transactionAPI.createTransaction(data);
      }
      
      // Refresh the transactions list
      await fetchTransactions();
      setIsFormOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.deleteTransaction(id);
        // Refresh the transactions list
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  if (loading) {
    return (
      <TransactionsContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          Loading transactions...
        </div>
      </TransactionsContainer>
    );
  }

  return (
    <TransactionsContainer>
      <PageHeader>
        <PageTitle>Transactions</PageTitle>
        <Controls>
          <SearchContainer>
            <SearchIcon />
            <SearchInput placeholder="Search transactions..." />
          </SearchContainer>
          <FilterButton>
            <FaFilter />
          </FilterButton>
          <Button onClick={handleAddTransaction}>
            <FaPlus /> Add Transaction
          </Button>
        </Controls>
      </PageHeader>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Description</TableHeader>
              <TableHeader>Account</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.account?.account_name || 'N/A'}</TableCell>
                <TableCell>{transaction.category?.category_name || 'N/A'}</TableCell>
                <TableCell>{transaction.transaction_date}</TableCell>
                <AmountCell type={transaction.transaction_type}>
                  {transaction.transaction_type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </AmountCell>
                <TableCell>
                  <ActionButton onClick={() => handleEditTransaction(transaction)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteTransaction(transaction.transaction_id)}>
                    <FaTrash />
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <TransactionForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
      />
    </TransactionsContainer>
  );
};

export default Transactions;