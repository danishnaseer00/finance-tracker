import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaWallet } from 'react-icons/fa';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.surface} 0%, ${(props) => props.theme.colors.background} 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.secondary});
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    font-size: 2.5rem;
    color: ${(props) => props.theme.colors.primary};
    margin-right: 0.75rem;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  font-weight: 700;
  color: ${(props) => props.theme.colors.textPrimary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSize.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.textPrimary};
  font-size: ${(props) => props.theme.fontSize.md};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textTertiary};
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textTertiary};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: ${(props) => props.theme.colors.danger};
  color: white;
  padding: 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: ${(props) => props.theme.fontSize.sm};
  text-align: center;
  margin-bottom: 1rem;
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.fontSize.sm};
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primaryDark};
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, state } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Header>
          <Logo>
            <FaWallet />
            <h1>FinanceTracker</h1>
          </Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={state.isLoading}>
            {state.isLoading ? <LoadingSpinner /> : 'Sign In'}
          </Button>
        </Form>

        <LinkContainer>
          <StyledLink to="/register">Create an account</StyledLink>
          <StyledLink to="/">Forgot password?</StyledLink>
        </LinkContainer>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;