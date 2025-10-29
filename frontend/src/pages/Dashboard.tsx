import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartPie, FaCreditCard, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BarChartComponent from '../components/charts/BarChartComponent';
import PieChartComponent from '../components/charts/PieChartComponent';
import LineChartComponent from '../components/charts/LineChartComponent';
import { transactionAPI } from '../services/api';

// Placeholder components - we'll implement these later
const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h1`
  font-size: ${(props) => props.theme.fontSize.xl};
  font-weight: 600;
  color: ${(props) => props.theme.colors.textPrimary};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    align-self: flex-end;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
`;

const MainContent = styled.main`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  flex: 1;
  
  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  color: ${(props) => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: ${(props) => props.theme.fontSize['3xl']};
  font-weight: 700;
  color: ${(props) => props.theme.colors.textPrimary};
  margin: 0.5rem 0;
`;

const CardSubtitle = styled.div`
  color: ${(props) => props.theme.colors.textTertiary};
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  margin-left: 70px; /* Account for sidebar */
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 2rem;
  
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
`;

const SummaryIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: ${(props) => props.theme.fontSize.xl};

  &.balance {
    background: rgba(59, 130, 246, 0.1);
    color: ${(props) => props.theme.colors.primary};
  }

  &.income {
    background: rgba(16, 185, 129, 0.1);
    color: ${(props) => props.theme.colors.success};
  }

  &.expense {
    background: rgba(239, 68, 68, 0.1);
    color: ${(props) => props.theme.colors.danger};
  }

  &.transactions {
    background: rgba(139, 92, 246, 0.1);
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: [],
  });
  const [expensesByCategory, setExpensesByCategory] = useState<{name: string; value: number}[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // Fetch transactions
      const transactionsResponse = await transactionAPI.getTransactions();
      const transactions = transactionsResponse.data;
      
      // Calculate summary data
      const totalBalance = transactions
        .filter((t: any) => t.transaction_type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0) 
        - transactions
          .filter((t: any) => t.transaction_type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const totalIncome = transactions
        .filter((t: any) => t.transaction_type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const totalExpense = transactions
        .filter((t: any) => t.transaction_type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      setDashboardData({
        totalBalance,
        totalIncome,
        totalExpense,
        recentTransactions: transactions.slice(0, 5), // Get last 5 transactions
      });

      // Group expenses by category
      const categoryMap: Record<string, number> = {};
      transactions
        .filter((t: any) => t.transaction_type === 'expense')
        .forEach((t: any) => {
          const category = t.category?.category_name || 'Uncategorized';
          categoryMap[category] = (categoryMap[category] || 0) + t.amount;
        });

      const expensesData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));

      setExpensesByCategory(expensesData);

      // Generate mock monthly trends (in a real app, this would come from the API)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const trends = months.map((name) => ({
        name,
        income: 3000 + Math.random() * 400,
        expenses: 2000 + Math.random() * 400,
      }));

      // Calculate balance based on income and expenses
      const trendsWithBalance = trends.map(trend => ({
        ...trend,
        balance: trend.income - trend.expenses,
      }));

      setMonthlyTrends(trendsWithBalance);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const userInitials = state.user 
    ? `${state.user.first_name?.charAt(0) || ''}${state.user.last_name?.charAt(0) || ''}`.toUpperCase()
    : '?';

  return (
    <DashboardContainer>
      <PageHeader>
        <HeaderTitle>Dashboard</HeaderTitle>
        <UserSection>
          <span>Welcome, {state.user?.first_name || state.user?.username}!</span>
          <UserAvatar>{userInitials}</UserAvatar>
        </UserSection>
      </PageHeader>

      <SummarySection>
        <SummaryCard>
          <SummaryIcon className="balance">
            <FaWallet />
          </SummaryIcon>
          <CardTitle>Total Balance</CardTitle>
          <CardValue>${dashboardData.totalBalance.toFixed(2)}</CardValue>
          <CardSubtitle>Current account balance</CardSubtitle>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon className="income">
            <FaArrowUp />
          </SummaryIcon>
          <CardTitle>Total Income</CardTitle>
          <CardValue style={{ color: '#10b981' }}>${dashboardData.totalIncome.toFixed(2)}</CardValue>
          <CardSubtitle>This month</CardSubtitle>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon className="expense">
            <FaArrowDown />
          </SummaryIcon>
          <CardTitle>Total Expenses</CardTitle>
          <CardValue style={{ color: '#ef4444' }}>${dashboardData.totalExpense.toFixed(2)}</CardValue>
          <CardSubtitle>This month</CardSubtitle>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon className="transactions">
            <FaChartPie />
          </SummaryIcon>
          <CardTitle>Transactions</CardTitle>
          <CardValue>{dashboardData.recentTransactions.length}</CardValue>
          <CardSubtitle>Recent activity</CardSubtitle>
        </SummaryCard>
      </SummarySection>

      <MainContent>
        <Card style={{ gridRow: 'span 2' }}>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <PieChartComponent 
            data={expensesByCategory} 
            title="Expense Distribution" 
          />
        </Card>

        <Card style={{ gridRow: 'span 2' }}>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <BarChartComponent 
            data={expensesByCategory} 
            title="Monthly Expenses by Category" 
          />
        </Card>

        <Card style={{ gridRow: 'span 2' }}>
          <CardHeader>
            <CardTitle>Financial Trends</CardTitle>
          </CardHeader>
          <LineChartComponent 
            data={monthlyTrends} 
            title="Income, Expenses & Balance Trend" 
          />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Link to="/transactions">
              <FaPlus style={{ color: 'var(--primary-color)' }} />
            </Link>
          </CardHeader>
          <div>
            {dashboardData.recentTransactions.map((transaction: any) => (
              <div key={transaction.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{transaction.description}</span>
                  <span style={{ color: transaction.transaction_type === 'income' ? '#10b981' : '#ef4444' }}>
                    {transaction.transaction_type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                  {transaction.transaction_date}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <Link to="/accounts">
              <FaCreditCard style={{ color: 'var(--primary-color)' }} />
            </Link>
          </CardHeader>
          <div>
            {/* Account list will be populated via API in the Accounts component */}
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1rem' }}>
              View and manage your accounts
            </p>
          </div>
        </Card>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;