import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/transactions/Transactions';
import Accounts from '../pages/accounts/Accounts';
import PrivateRoute from './PrivateRoute';

const AppRoutes: React.FC = () => {
  const { state } = useAuth();

  return (
    <Routes>
      <Route path="/" element={state.token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={!state.token ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!state.token ? <Register /> : <Navigate to="/dashboard" />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/accounts" 
        element={
          <PrivateRoute>
            <Accounts />
          </PrivateRoute>
        } 
      />
      {/* Add more routes as needed */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;