import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  colors: {
    primary: '#00d4ff', // Electric Cyan
    primaryDark: '#00a3cc',
    secondary: '#7c3aed', // Deep Violet
    secondaryDark: '#6d28d9',
    success: '#00ff9d', // Neon Green
    danger: '#ff0055', // Neon Red
    warning: '#ffbd00', // Neon Yellow
    info: '#00d4ff',
    background: '#09090b', // True Dark (Zinc 950)
    surface: '#18181b', // Zinc 900
    surfaceLight: '#27272a', // Zinc 800
    textPrimary: '#ffffff', // Pure White
    textSecondary: '#a1a1aa', // Zinc 400
    textTertiary: '#71717a', // Zinc 500
    border: '#27272a', // Zinc 800
    shadow: 'rgba(0, 0, 0, 0.6)',
    gradients: {
      primary: 'linear-gradient(145deg, #00d4ff, #00a3cc)',
      secondary: 'linear-gradient(145deg, #7c3aed, #6d28d9)',
      surface: 'linear-gradient(145deg, #18181b, #202023)',
    },
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
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
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
  shadows: {
    neumorphic: '10px 10px 20px #050506, -10px -10px 20px #151518',
    neumorphicInset: 'inset 10px 10px 20px #050506, inset -10px -10px 20px #151518',
    neumorphicHover: '5px 5px 10px #050506, -5px -5px 10px #151518',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    transition: all 0.3s ease;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: ${props => props.theme.colors.textPrimary};
  }

  p {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: 'Outfit', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.surfaceLight};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textTertiary};
  }

  /* Utility Classes for Layout */
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text-gradient {
    background: ${props => props.theme.colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export default GlobalStyle;