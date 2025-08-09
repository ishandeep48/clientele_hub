import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import OrdersChart from './charts/OrdersChart.tsx';
import SalesChart from './charts/SalesChart.tsx';
import PaymentsChart from './charts/PaymentsChart.tsx';
import LeadsVsCustomersChart from './charts/LeadsVsCustomersChart.tsx';
import FeedbackSentimentChart from './charts/FeedbackSentimentChart.tsx';

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Sales Module
    const salesData = JSON.parse(localStorage.getItem('sales') || '[]');
    setTotalSales(salesData.length);

    const revenue = salesData.reduce((sum: number, sale: any) => sum + Number(sale.total || 0), 0);
    setTotalRevenue(revenue);

    // Customers Module
    const customerData = JSON.parse(localStorage.getItem('customers') || '[]');
    setTotalCustomers(customerData.length);

    // Orders Module
    const orderData = JSON.parse(localStorage.getItem('orders') || '[]');
    const pending = orderData.filter((order: any) => order.status?.toLowerCase() === 'pending').length;
    setPendingOrders(pending);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header-section">
      <h1>Dashboard</h1>
      <button className="download-button">
        <i className="download-icon" /> Download Report
      </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <h2>₹{totalRevenue.toLocaleString()}</h2>
          <p>Based on all sales</p>
        </div>
        <div className="card">
          <h4>Total Customers</h4>
          <h2>+{totalCustomers}</h2>
          <p>All-time customer count</p>
        </div>
        <div className="card">
          <h4>Sales</h4>
          <h2>+{totalSales}</h2>
          <p>Total number of sales transactions</p>
        </div>
        <div className="card">
          <h4>Pending Orders</h4>
          <h2>+{pendingOrders}</h2>
          <p>Orders awaiting processing</p>
        </div>
      </div>

      {/* Charts Section */}
      <h2 className="section-title">Analytics Overview</h2>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Orders Overview</h3>
          <OrdersChart />
        </div>
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <SalesChart />
        </div>
        <div className="chart-card">
          <h3>Payments Overview</h3>
          <PaymentsChart />
        </div>
        <div className="chart-card">
          <h3>Leads vs Customers</h3>
          <LeadsVsCustomersChart />
        </div>
        <div className="chart-card">
          <h3>Feedback Sentiment</h3>
          <FeedbackSentimentChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
