import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { categoryAPI } from '../services/api';

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

  option {
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textPrimary};
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: any) => void;
  initialData?: any;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    category_id: '',
    budget_amount: '',
    month: (currentDate.getMonth() + 1).toString(),
    year: currentDate.getFullYear().toString(),
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        category_id: initialData.category_id?.toString() || '',
        budget_amount: initialData.budget_amount?.toString() || '',
        month: initialData.month?.toString() || (currentDate.getMonth() + 1).toString(),
        year: initialData.year?.toString() || currentDate.getFullYear().toString(),
      });
    } else {
      setFormData({
        category_id: '',
        budget_amount: '',
        month: (currentDate.getMonth() + 1).toString(),
        year: currentDate.getFullYear().toString(),
      });
    }
  }, [initialData, isOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getCategories();
      // Only show expense categories for budgets
      const expenseCategories = response.data.filter((cat: any) => cat.category_type === 'expense');
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      category_id: parseInt(formData.category_id),
      budget_amount: parseFloat(formData.budget_amount),
      month: parseInt(formData.month),
      year: parseInt(formData.year),
    };
    
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <FormOverlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormHeader>
          <FormTitle>{initialData ? 'Edit Budget' : 'Add New Budget'}</FormTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </FormHeader>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Category *</FormLabel>
              <FormSelect
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.icon} {category.category_name}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel>Budget Amount *</FormLabel>
              <FormInput
                type="number"
                name="budget_amount"
                value={formData.budget_amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Month *</FormLabel>
              <FormSelect
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel>Year *</FormLabel>
              <FormSelect
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {[2024, 2025, 2026, 2027, 2028].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </FormSelect>
            </FormGroup>

            <SubmitButton type="submit">
              <FaPlus />
              {initialData ? 'Update Budget' : 'Add Budget'}
            </SubmitButton>
          </form>
        )}
      </FormContainer>
    </FormOverlay>
  );
};

export default BudgetForm;