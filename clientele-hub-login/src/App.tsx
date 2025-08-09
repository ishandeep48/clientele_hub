import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Login from './components/Login/Login.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import Orders from './components/orders/Orders.tsx';
import Support from './components/support/Support.tsx';
import Billing from './components/billing/Billing.tsx';
import Feedback from './components/feedback/Feedback.tsx';
import Account from './components/account/Account.tsx';
import MainLayout from './components/layout/MainLayout.tsx';
import Notifications from './components/notifications/Notifications.tsx';

// 🔒 Private Route Wrapper
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('userToken');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLoginSuccess = (): void => {
    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="orders" element={<Orders />} />
          <Route path="support" element={<Support />} />
          <Route path="billing" element={<Billing />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="account" element={<Account />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
