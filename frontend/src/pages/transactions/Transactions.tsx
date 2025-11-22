import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import TransactionForm from '../../components/TransactionForm.tsx';
import { transactionAPI } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button, IconButton } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const TitleSection = styled.div`
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    background: ${props => props.theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      font-size: 1.75rem;
      text-align: center;
      margin-bottom: 0;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    
    & > button {
      width: 100%;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 250px;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textTertiary};
    z-index: 1;
  }
  
  input {
    padding-left: 2.5rem;
    width: 100%;
  }
`;

const TableContainer = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const TableHeader = styled.th`
  padding: 1.25rem 1.5rem;
  text-align: left;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  white-space: nowrap;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceLight};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.95rem;
`;

const AmountCell = styled(TableCell) <{ type: string }>`
  color: ${props =>
    props.type === 'income'
      ? props.theme.colors.success
      : props.theme.colors.danger
  };
  font-weight: 600;
`;

const CategoryBadge = styled.span`
  background: ${props => props.theme.colors.background};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 0.5rem;
`;

const Transactions: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        await transactionAPI.updateTransaction(editingTransaction.transaction_id, data);
      } else {
        await transactionAPI.createTransaction(data);
      }
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
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading transactions...
      </div>
    );
  }

  return (
    <div>
      <HeaderSection>
        <TitleSection>
          <h1>Transactions</h1>
        </TitleSection>
        <Controls>
          <SearchWrapper>
            <FaSearch />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
          <Button variant="secondary">
            <FaFilter /> Filter
          </Button>
          <Button variant="primary" onClick={handleAddTransaction}>
            <FaPlus /> Add Transaction
          </Button>
        </Controls>
      </HeaderSection>

      <TableContainer>
        <TableWrapper>
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.account?.account_name || 'N/A'}</TableCell>
                    <TableCell>
                      <CategoryBadge>
                        {transaction.category?.category_name || 'Uncategorized'}
                      </CategoryBadge>
                    </TableCell>
                    <TableCell>{transaction.transaction_date}</TableCell>
                    <AmountCell type={transaction.transaction_type}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </AmountCell>
                    <ActionCell>
                      <IconButton size="sm" onClick={() => handleEditTransaction(transaction)}>
                        <FaEdit />
                      </IconButton>
                      <IconButton size="sm" variant="danger" onClick={() => handleDeleteTransaction(transaction.transaction_id)}>
                        <FaTrash />
                      </IconButton>
                    </ActionCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </TableContainer>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Transactions;