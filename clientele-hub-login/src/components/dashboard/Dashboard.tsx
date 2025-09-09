import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Order {
  id: string;
  orderId: string;
  product: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  createdAt: string;
}

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersLastMonth, setOrdersLastMonth] = useState(0);
  const [pendingPayments, setPendingPayments] = useState('₹0.00');
  const [activeTickets, setActiveTickets] = useState(0);
  const [recentOrders, setRecentOrders] = useState([] as Order[]);

  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      const res = await fetch('http://localhost:5000/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return;
      setTotalOrders(data.totalOrders || 0);
      setOrdersLastMonth(data.ordersLastMonth || 0);
      setPendingPayments(data.pendingPayments || '₹0.00');
      setActiveTickets(data.activeTickets || 0);
      setRecentOrders((data.recentOrders || []) as Order[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handleStorageChange = () => { loadDashboardData(); };
    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(loadDashboardData, 10000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="dashboard-content-area">
      <div className="stats-grid">
        <div className="stats-card">
          <div className="card-header">
            <span className="card-title">Total Orders</span>
          </div>
          <div className="card-value">{totalOrders}</div>
          <div className="card-change">Orders in last month: {ordersLastMonth}</div>
        </div>

        <div className="stats-card">
          <div className="card-header">
            <span className="card-title">Pending Payments</span>
          </div>
          <div className="card-value">{pendingPayments}</div>
          <div className="card-change">1 payment upcoming</div>
        </div>

        <div className="stats-card">
          <div className="card-header">
            <span className="card-title">Active Support Tickets</span>
          </div>
          <div className="card-value">{activeTickets}</div>
          <div className="card-change">1 waiting for response</div>
        </div>
      </div>

      <div className="dashboard-bottom-row">
        <div className="recent-orders-card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <a href="#" className="view-all-link"  onClick={() => navigate('/orders')}>View All</a>
          </div>
          <p className="card-subtitle">An overview of your most recent orders.</p>
          <div className="overflow-x-auto">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderId}</td>
                      <td>{order.product}</td>
                      <td>
                        <span className={`status-badge ${
                          order.status === 'Completed' ? 'status-completed' :
                          order.status === 'In Progress' ? 'status-in-progress' :
                          'status-pending'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-sm text-gray-500">No recent orders.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <p className="card-subtitle">Need help or want to see what's new?</p>
          <div className="action-buttons">
            <button className="button-primary" onClick={() => navigate('/support')}>Raise a Ticket</button>
            {/* <button className="button-secondary" onClick={() => navigate('/notifications')}>
              View Notifications
            </button> */}
            <button className="button-tertiary" onClick={() => navigate('/account')}>Manage Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
