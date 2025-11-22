import styled from 'styled-components';

interface CardProps {
    padding?: string;
    width?: string;
    height?: string;
    flex?: boolean;
    column?: boolean;
    center?: boolean;
}

export const Card = styled.div<CardProps>`
  background: ${props => props.theme.colors.surface};
  box-shadow: ${props => props.theme.shadows.neumorphic};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.padding || props.theme.spacing.lg};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  transition: all 0.3s ease;
  
  display: ${props => (props.flex || props.center ? 'flex' : 'block')};
  flex-direction: ${props => (props.column ? 'column' : 'row')};
  justify-content: ${props => (props.center ? 'center' : 'flex-start')};
  align-items: ${props => (props.center ? 'center' : 'stretch')};

  &:hover {
    box-shadow: ${props => props.theme.shadows.neumorphicHover};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2, h3 {
    margin: 0;
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const CardBody = styled.div`
  width: 100%;
`;
