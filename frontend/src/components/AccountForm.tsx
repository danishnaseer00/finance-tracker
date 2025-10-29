import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus } from 'react-icons/fa';

const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${(props) => props.theme.colors.surface};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize.xl};
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.textTertiary};
  font-size: ${(props) => props.theme.fontSize.lg};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.textPrimary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
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
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
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
`;

const SubmitButton = styled.button`
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
  margin-top: 1rem;

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

const AccountForm: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (account: any) => void;
  initialData?: any;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    account_name: '',
    account_type: 'bank',
    balance: '',
    currency: 'USD',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        balance: initialData.balance ? initialData.balance.toString() : '',
      });
    } else {
      // Reset form when not editing
      setFormData({
        account_name: '',
        account_type: 'bank',
        balance: '',
        currency: 'USD',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <FormOverlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <FormTitle>{initialData ? 'Edit Account' : 'Add New Account'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Account Name</FormLabel>
            <FormInput
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              placeholder="e.g. Main Checking"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Account Type</FormLabel>
            <FormSelect
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              required
            >
              <option value="bank">Bank Account</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="investment">Investment</option>
              <option value="savings">Savings</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Initial Balance</FormLabel>
            <FormInput
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Currency</FormLabel>
            <FormSelect
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </FormSelect>
          </FormGroup>

          <SubmitButton type="submit">
            <FaPlus style={{ marginRight: '0.5rem' }} />
            {initialData ? 'Update Account' : 'Add Account'}
          </SubmitButton>
        </form>
      </FormContainer>
    </FormOverlay>
  );
};

export default AccountForm;