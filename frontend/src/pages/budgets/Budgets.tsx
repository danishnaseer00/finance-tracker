import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { budgetAPI, transactionAPI } from '../../services/api';
import BudgetForm from '../../components/BudgetForm';

const BudgetsContainer = styled.div`
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  padding-left: 5rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 1rem;
    padding-left: 5rem;
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

const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const BudgetCard = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  position: relative;
`;

const CategoryName = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BudgetInfo = styled.div`
  margin: 1rem 0;
`;

const BudgetLabel = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const BudgetAmount = styled.div`
  font-size: ${(props) => props.theme.fontSize.xl};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 700;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(props) => props.theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const Progress = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${(props) => Math.min(props.$percentage, 100)}%;
  background: ${(props) => 
    props.$percentage > 100 
      ? props.theme.colors.danger 
      : props.$percentage > 80 
        ? props.theme.colors.warning 
        : props.theme.colors.success
  };
  transition: width 0.3s ease;
`;

const SpentInfo = styled.div<{ $overBudget: boolean }>`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.$overBudget ? props.theme.colors.danger : props.theme.colors.textTertiary};
  font-weight: ${(props) => props.$overBudget ? '600' : '400'};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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

  &.delete:hover {
    color: ${(props) => props.theme.colors.danger};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const fetchBudgets = async () => {
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        budgetAPI.getBudgets(),
        transactionAPI.getTransactions()
      ]);
      setBudgets(budgetsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const calculateSpent = (budget: any) => {
    const spent = transactions
      .filter((t: any) => {
        const tDate = new Date(t.transaction_date);
        return (
          t.category_id === budget.category_id &&
          t.transaction_type === 'expense' &&
          tDate.getMonth() + 1 === budget.month &&
          tDate.getFullYear() === budget.year
        );
      })
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    
    return spent;
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingBudget) {
        // Update functionality would go here if backend supports it
        alert('Budget update not yet implemented in backend');
      } else {
        await budgetAPI.createBudget(data);
      }
      
      await fetchBudgets();
      setIsFormOpen(false);
      setEditingBudget(null);
    } catch (error: any) {
      console.error('Error saving budget:', error);
      alert(error.response?.data?.detail || 'Failed to save budget');
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        // Delete functionality would go here if backend supports it
        alert('Budget delete not yet implemented in backend');
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget');
      }
    }
  };

  if (loading) {
    return (
      <BudgetsContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          Loading budgets...
        </div>
      </BudgetsContainer>
    );
  }

  return (
    <BudgetsContainer>
      <PageHeader>
        <PageTitle>Budgets</PageTitle>
        <Button onClick={handleAddBudget}>
          <FaPlus /> Add Budget
        </Button>
      </PageHeader>

      {budgets.length === 0 ? (
        <EmptyState>
          <h2 style={{ marginBottom: '1rem' }}>No Budgets Yet</h2>
          <p>Create your first budget to start tracking your spending limits</p>
        </EmptyState>
      ) : (
        <BudgetGrid>
          {budgets.map((budget: any) => {
            const spent = calculateSpent(budget);
            const budgetAmount = parseFloat(budget.budget_amount);
            const percentage = (spent / budgetAmount) * 100;
            const overBudget = spent > budgetAmount;

            return (
              <BudgetCard key={budget.budget_id}>
                <CategoryName>
                  {budget.category?.icon} {budget.category?.category_name || 'Unknown Category'}
                </CategoryName>
                <BudgetInfo>
                  <BudgetLabel>Budget Amount</BudgetLabel>
                  <BudgetAmount>${budgetAmount.toFixed(2)}</BudgetAmount>
                </BudgetInfo>
                <BudgetInfo>
                  <BudgetLabel>Period</BudgetLabel>
                  <div style={{ color: 'var(--text-primary)' }}>
                    {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
                  </div>
                </BudgetInfo>
                <ProgressBar>
                  <Progress $percentage={percentage} />
                </ProgressBar>
                <SpentInfo $overBudget={overBudget}>
                  ${spent.toFixed(2)} of ${budgetAmount.toFixed(2)} spent
                  {overBudget && ` (Over by $${(spent - budgetAmount).toFixed(2)})`}
                </SpentInfo>
                <Actions>
                  <ActionButton onClick={() => handleEditBudget(budget)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDeleteBudget(budget.budget_id)}>
                    <FaTrash />
                  </ActionButton>
                </Actions>
              </BudgetCard>
            );
          })}
        </BudgetGrid>
      )}

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBudget}
      />
    </BudgetsContainer>
  );
};

export default Budgets;
