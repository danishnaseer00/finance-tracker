import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaWallet } from 'react-icons/fa';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${(props) => props.theme.colors.surface} 0%, ${(props) => props.theme.colors.background} 100%);
  padding: 1rem;
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 450px;
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
    background: linear-gradient(90deg, ${(props) => props.theme.colors.secondary}, ${(props) => props.theme.colors.primary});
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
    color: ${(props) => props.theme.colors.secondary};
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
    border-color: ${(props) => props.theme.colors.secondary};
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
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
  background: linear-gradient(90deg, ${(props) => props.theme.colors.secondary}, ${(props) => props.theme.colors.secondaryDark});
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
    box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
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
  text-align: center;
  margin-top: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  font-size: ${(props) => props.theme.fontSize.md};
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, state } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Header>
          <Logo>
            <FaWallet />
            <h1>FinanceTracker</h1>
          </Logo>
          <Title>Create Your Account</Title>
          <Subtitle>Join us to manage your finances effectively</Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <InputGroup style={{ flex: 1 }}>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup style={{ flex: 1 }}>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </InputGroup>
          </div>

          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <Button type="submit" disabled={state.isLoading}>
            {state.isLoading ? <LoadingSpinner /> : 'Create Account'}
          </Button>
        </Form>

        <LinkContainer>
          <p>
            Already have an account? <StyledLink to="/login">Sign in</StyledLink>
          </p>
        </LinkContainer>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;