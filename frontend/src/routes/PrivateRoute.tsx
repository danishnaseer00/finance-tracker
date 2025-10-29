import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../layouts/Layout';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { state } = useAuth();
  
  return state.token ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

export default PrivateRoute;