import styled, { css } from 'styled-components';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    active?: boolean;
}

const getVariantStyles = (props: any) => {
    switch (props.variant) {
        case 'primary':
            return css`
        color: ${props.theme.colors.primary};
        &:hover {
          color: ${props.theme.colors.primaryDark};
        }
      `;
        case 'secondary':
            return css`
        color: ${props.theme.colors.secondary};
        &:hover {
          color: ${props.theme.colors.secondaryDark};
        }
      `;
        case 'danger':
            return css`
        color: ${props.theme.colors.danger};
      `;
        case 'success':
            return css`
        color: ${props.theme.colors.success};
      `;
        default:
            return css`
        color: ${props.theme.colors.textPrimary};
      `;
    }
};

export const Button = styled.button<ButtonProps>`
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.active ? props.theme.shadows.neumorphicInset : props.theme.shadows.neumorphic};
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props =>
        props.size === 'sm' ? '0.5rem 1rem' :
            props.size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  font-weight: 600;
  font-size: ${props =>
        props.size === 'sm' ? props.theme.fontSize.xs :
            props.size === 'lg' ? props.theme.fontSize.lg : props.theme.fontSize.sm};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => getVariantStyles(props)}

  &:hover {
    box-shadow: ${props => props.theme.shadows.neumorphicHover};
    transform: translateY(-1px);
  }

  &:active {
    box-shadow: ${props => props.theme.shadows.neumorphicInset};
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const IconButton = styled(Button)`
  padding: 0.75rem;
  border-radius: 50%;
  aspect-ratio: 1;
`;
