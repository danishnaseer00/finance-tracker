import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthAction {
  type: string;
  payload?: any;
}

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false, error: null };
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        error: null 
      };
    case 'REGISTER_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user),
        },
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authAPI.login({ username, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: access_token,
          user: user,
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      await authAPI.register(userData);
      // Automatically log in after successful registration
      await login(userData.username, userData.password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};