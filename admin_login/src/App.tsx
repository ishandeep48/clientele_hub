import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login.tsx';
import MainLayout from './components/layout/Mainlayout.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import Leads from './components/leads/Leads.tsx';
import Customers from './components/customers/Customers.tsx';
import Products from './components/products/Products.tsx';
import Sales from './components/sales/Sales.tsx';
import AdminOrders from './components/orders/AdminOrders.tsx';
import Bills from './components/bills/Bills.tsx';
import Tasks from './components/tasks/Tasks.tsx';
import Payments from './components/payment/Payments.tsx';
import Feedback from './components/feedback/Feedback.tsx';
import AdminNotifications from './components/notification/AdminNotifications.tsx';
import AdminSettings from './components/setting/AdminSettings.tsx';
import ProtectedRoute from './components/protectedroutes/protectedRoute.tsx';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="leads" element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          } />
          <Route path="customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="sales" element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="bills" element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          } />
          <Route path="tasks" element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          } />
          <Route path="payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="feedback" element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          } />
          <Route path="notifications" element={
            <ProtectedRoute>
              <AdminNotifications />
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
