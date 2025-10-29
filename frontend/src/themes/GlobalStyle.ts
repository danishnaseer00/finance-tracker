import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#3b82f6', // blue-500
    primaryDark: '#2563eb', // blue-600
    secondary: '#8b5cf6', // violet-500
    secondaryDark: '#7c3aed', // violet-600
    success: '#10b981', // emerald-500
    danger: '#ef4444', // red-500
    warning: '#f59e0b', // amber-500
    info: '#0ea5e9', // sky-500
    background: '#0f172a', // slate-900
    surface: '#1e293b', // slate-800
    surfaceLight: '#334155', // slate-700
    textPrimary: '#f1f5f9', // slate-100
    textSecondary: '#cbd5e1', // slate-200
    textTertiary: '#94a3b8', // slate-400
    border: '#334155', // slate-700
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  breakpoints: {
    xs: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.surfaceLight};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textTertiary};
  }

  /* Responsive Design */
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    .dashboard-grid {
      grid-template-columns: 1fr !important;
    }
    
    .card-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .controls {
      width: 100%;
      flex-wrap: wrap;
    }
    
    .search-container {
      width: 100%;
    }
    
    .search-input {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    .main-content {
      padding: 1rem;
    }
    
    .summary-section {
      padding: 1rem;
      grid-template-columns: 1fr !important;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .table {
      min-width: 600px;
    }
  }
`;

export default GlobalStyle;