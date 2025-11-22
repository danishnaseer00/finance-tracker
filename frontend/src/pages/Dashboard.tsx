import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
} from 'chart.js';
import { accountAPI, transactionAPI } from '../services/api';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0;
    background: ${props => props.theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      font-size: 1.75rem;
    }
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.1rem;
    margin-top: 0.5rem;

    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      display: none;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(Card)`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.theme.colors.gradients.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.color};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TransactionIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'income' ? props.theme.colors.success : props.theme.colors.danger};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neumorphic};
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  span:first-child {
    color: ${props => props.theme.colors.textPrimary};
    font-weight: 500;
  }
  
  span:last-child {
    color: ${props => props.theme.colors.textTertiary};
    font-size: 0.85rem;
  }
`;

const TransactionAmount = styled.div<{ type: string }>`
  font-weight: 600;
  color: ${props => props.type === 'income' ? props.theme.colors.success : props.theme.colors.textPrimary};
`;

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          accountAPI.getAccounts(),
          transactionAPI.getTransactions()
        ]);
        setAccounts(accountsRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  const recentTransactions = transactions.slice(0, 5);

  const income = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Calculate expenses by category for Pie Chart
  const expensesByCategory = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((acc: any, t) => {
      const category = t.category?.category_name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Calculate monthly trends for Line Chart (Simplified for demo)
  const monthlyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [1000, 1500, 2000, 4000, 1800, 2500],
        borderColor: '#ff0055',
        backgroundColor: 'rgba(255, 0, 85, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ecf0f3',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#a0a5a9',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#a0a5a9',
        },
      },
    },
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading dashboard...</div>;
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {state.user?.first_name || state.user?.username}!</p>
        </div>
        <Link to="/transactions">
          <Button variant="primary">
            <FaPlus /> Add Transaction
          </Button>
        </Link>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <IconWrapper color="#00d4ff">
              <FaWallet />
            </IconWrapper>
          </StatHeader>
          <StatValue>${totalBalance.toFixed(2)}</StatValue>
          <StatLabel>Total Balance</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <IconWrapper color="#00ff9d">
              <FaArrowUp />
            </IconWrapper>
          </StatHeader>
          <StatValue>${income.toFixed(2)}</StatValue>
          <StatLabel>Total Income</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <IconWrapper color="#ff0055">
              <FaArrowDown />
            </IconWrapper>
          </StatHeader>
          <StatValue>${expenses.toFixed(2)}</StatValue>
          <StatLabel>Total Expenses</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <IconWrapper color="#7c3aed">
              <FaChartLine />
            </IconWrapper>
          </StatHeader>
          <StatValue>{transactions.length}</StatValue>
          <StatLabel>Total Transactions</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <Card>
          <CardHeader>
            <h3>Financial Overview</h3>
          </CardHeader>
          <CardBody>
            <Line data={monthlyTrends} options={chartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>Expenses by Category</h3>
          </CardHeader>
          <CardBody>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieChartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#ecf0f3' }
                  }
                }
              }} />
            </div>
          </CardBody>
        </Card>
      </ChartsGrid>

      <Card>
        <CardHeader>
          <h3>Recent Transactions</h3>
        </CardHeader>
        <CardBody>
          <TransactionList>
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t) => (
                <TransactionItem key={t.transaction_id}>
                  <TransactionInfo>
                    <TransactionIcon type={t.transaction_type}>
                      {t.transaction_type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                    </TransactionIcon>
                    <TransactionDetails>
                      <span>{t.description}</span>
                      <span>{new Date(t.transaction_date).toLocaleDateString()}</span>
                    </TransactionDetails>
                  </TransactionInfo>
                  <TransactionAmount type={t.transaction_type}>
                    {t.transaction_type === 'income' ? '+' : '-'}${Math.abs(parseFloat(t.amount)).toFixed(2)}
                  </TransactionAmount>
                </TransactionItem>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#a0a5a9' }}>No recent transactions</p>
            )}
          </TransactionList>
        </CardBody>
      </Card>
    </DashboardContainer>
  );
};

export default Dashboard;