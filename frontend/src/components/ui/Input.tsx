import styled from 'styled-components';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.md};
  width: 100%;
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: 500;
  margin-left: ${props => props.theme.spacing.xs};
`;

export const Input = styled.input`
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.md};
  width: 100%;
  transition: all 0.3s ease;

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.neumorphicInset}, 
                0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const Select = styled.select`
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.neumorphicInset};
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSize.md};
  width: 100%;
  cursor: pointer;
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a5a9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.neumorphicInset}, 
                0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;
