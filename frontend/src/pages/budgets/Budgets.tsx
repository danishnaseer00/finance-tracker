import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { budgetAPI, transactionAPI } from '../../services/api';
import BudgetForm from '../../components/BudgetForm';
import { Card } from '../../components/ui/Card';
import { Button, IconButton } from '../../components/ui/Button';

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
    gap: 1rem;
    margin-bottom: 1.5rem;

    & > button {
      width: 100%;
    }
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

const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const BudgetCardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CategoryName = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BudgetInfo = styled.div`
  margin-bottom: 1rem;
`;

const BudgetLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const BudgetAmount = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 700;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: 6px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
`;

const Progress = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => Math.min(props.$percentage, 100)}%;
  background: ${props =>
    props.$percentage > 100
      ? props.theme.colors.danger
      : props.$percentage > 80
        ? props.theme.colors.warning
        : props.theme.colors.success
  };
  transition: width 0.5s ease;
  border-radius: 6px;
`;

const SpentInfo = styled.div<{ $overBudget: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$overBudget ? props.theme.colors.danger : props.theme.colors.textTertiary};
  font-weight: ${props => props.$overBudget ? '600' : '400'};
  margin-bottom: 1.5rem;
  flex: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.textPrimary};
  }
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
        await budgetAPI.updateBudget(editingBudget.budget_id, data);
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
        await budgetAPI.deleteBudget(budgetId);
        await fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
        alert('Failed to delete budget');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading budgets...
      </div>
    );
  }

  return (
    <div>
      <HeaderSection>
        <TitleSection>
          <h1>Budgets</h1>
        </TitleSection>
        <Button variant="primary" onClick={handleAddBudget}>
          <FaPlus /> Add Budget
        </Button>
      </HeaderSection>

      {budgets.length === 0 ? (
        <EmptyState>
          <h2>No Budgets Yet</h2>
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
              <Card key={budget.budget_id}>
                <BudgetCardContent>
                  <CategoryName>
                    {budget.category?.icon} {budget.category?.category_name || 'Unknown Category'}
                  </CategoryName>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <BudgetInfo>
                      <BudgetLabel>Budget</BudgetLabel>
                      <BudgetAmount>${budgetAmount.toFixed(2)}</BudgetAmount>
                    </BudgetInfo>
                    <BudgetInfo style={{ textAlign: 'right' }}>
                      <BudgetLabel>Period</BudgetLabel>
                      <div style={{ color: '#ecf0f3', fontWeight: 500 }}>
                        {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
                      </div>
                    </BudgetInfo>
                  </div>

                  <ProgressBarContainer>
                    <Progress $percentage={percentage} />
                  </ProgressBarContainer>

                  <SpentInfo $overBudget={overBudget}>
                    ${spent.toFixed(2)} of ${budgetAmount.toFixed(2)} spent
                    {overBudget && ` (Over by $${(spent - budgetAmount).toFixed(2)})`}
                  </SpentInfo>

                  <ActionButtons>
                    <IconButton size="sm" onClick={() => handleEditBudget(budget)}>
                      <FaEdit />
                    </IconButton>
                    <IconButton size="sm" variant="danger" onClick={() => handleDeleteBudget(budget.budget_id)}>
                      <FaTrash />
                    </IconButton>
                  </ActionButtons>
                </BudgetCardContent>
              </Card>
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
    </div>
  );
};

export default Budgets;
