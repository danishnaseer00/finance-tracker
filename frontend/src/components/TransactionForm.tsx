import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

const TypeToggle = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: 1rem;
`;

const TypeToggleOption = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  background: ${(props) => 
    props.active 
      ? props.theme.colors.primary 
      : props.theme.colors.background
  };
  color: ${(props) => 
    props.active 
      ? 'white' 
      : props.theme.colors.textSecondary
  };
  border: none;
  font-weight: ${(props) => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:first-child {
    border-right: 1px solid ${(props) => props.theme.colors.border};
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

const TransactionForm: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (transaction: any) => void;
  initialData?: any;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    account_id: '',
    category_id: '',
    transaction_type: 'expense',
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        transaction_date: initialData.transaction_date || new Date().toISOString().split('T')[0],
      });
    } else {
      // Reset form when not editing
      setFormData({
        account_id: '',
        category_id: '',
        transaction_type: 'expense',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({
      ...prev,
      transaction_type: type
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
          <FormTitle>{initialData ? 'Edit Transaction' : 'Add New Transaction'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <TypeToggle>
            <TypeToggleOption 
              active={formData.transaction_type === 'expense'} 
              onClick={() => handleTypeChange('expense')}
            >
              <FaArrowDown style={{ marginRight: '0.5rem' }} /> Expense
            </TypeToggleOption>
            <TypeToggleOption 
              active={formData.transaction_type === 'income'} 
              onClick={() => handleTypeChange('income')}
            >
              <FaArrowUp style={{ marginRight: '0.5rem' }} /> Income
            </TypeToggleOption>
          </TypeToggle>

          <FormGroup>
            <FormLabel>Amount</FormLabel>
            <FormInput
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormInput
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Transaction description"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Account</FormLabel>
            <FormSelect
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              required
            >
              <option value="">Select an account</option>
              {/* Options will be populated from API */}
              <option value="1">Main Checking</option>
              <option value="2">Savings</option>
              <option value="3">Credit Card</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Category</FormLabel>
            <FormSelect
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {/* Options will be populated from API */}
              <option value="1">Food & Dining</option>
              <option value="2">Transportation</option>
              <option value="3">Shopping</option>
              <option value="4">Salary</option>
              <option value="5">Freelance</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Date</FormLabel>
            <FormInput
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Payment Method</FormLabel>
            <FormInput
              type="text"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              placeholder="Cash, Credit Card, etc."
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Notes</FormLabel>
            <FormInput
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </FormGroup>

          <SubmitButton type="submit">
            <FaPlus style={{ marginRight: '0.5rem' }} />
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </SubmitButton>
        </form>
      </FormContainer>
    </FormOverlay>
  );
};

export default TransactionForm;