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
  const [totalOrders, setTotalOrders] = useState<number>(3);
  const [ordersLastMonth, setOrdersLastMonth] = useState<number>(2);
  const [pendingPayments, setPendingPayments] = useState<string>('₹1,250.00');
  const [activeTickets, setActiveTickets] = useState<number>(3);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  const loadDashboardData = () => {
    try {
      const storedOrders = localStorage.getItem('dashboardOrders');
      if (storedOrders) {
        const parsedOrders: Order[] = JSON.parse(storedOrders);
        const sortedOrders = parsedOrders.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setRecentOrders(sortedOrders.slice(0, 3));
        setTotalOrders(parsedOrders.length);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const ordersInLastMonth = parsedOrders.filter(
          order => new Date(order.createdAt) > oneMonthAgo
        ).length;

        setOrdersLastMonth(ordersInLastMonth);
      } else {
        const defaultOrders: Order[] = [
          { id: 'ORD-001', orderId: 'ORD-001', product: 'Premium Website Design', status: 'Completed', createdAt: new Date().toISOString() },
          { id: 'ORD-002', orderId: 'ORD-002', product: 'Logo & Branding Package', status: 'In Progress', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { id: 'ORD-003', orderId: 'ORD-003', product: 'Social Media Campaign', status: 'Pending', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
        ];
        localStorage.setItem('dashboardOrders', JSON.stringify(defaultOrders));
        setRecentOrders(defaultOrders);
        setTotalOrders(defaultOrders.length);
        setOrdersLastMonth(2);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const handleStorageChange = () => loadDashboardData();
    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(loadDashboardData, 2000);
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
            <button className="button-secondary" onClick={() => navigate('/notifications')}>
              View Notifications
            </button>
            <button className="button-tertiary" onClick={() => navigate('/account')}>Manage Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
