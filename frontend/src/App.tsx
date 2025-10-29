import { ThemeProvider } from 'styled-components';
import GlobalStyle, { darkTheme } from './themes/GlobalStyle';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <GlobalStyle />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;