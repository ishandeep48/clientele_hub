import React from 'react';

// Define the interface for a single order object.
interface Order {
  id: string;
  product: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

// Define the props for the RecentOrders component.
interface RecentOrdersProps {
  orders: Order[];
}

// Use the defined props interface in the function signature.
const RecentOrders = ({ orders }: RecentOrdersProps) => {
  // Explicitly type the 'status' parameter to ensure it's one of the valid strings.
  const getStatusClass = (status: 'Completed' | 'In Progress' | 'Pending'): string => {
    if (status === 'Completed') return 'status-completed';
    if (status === 'In Progress') return 'status-in-progress';
    if (status === 'Pending') return 'status-pending';
    return '';
  };

  return (
    <div className="recent-orders-card">
      <div className="card-header">
        <h3 className="card-title">Recent Orders</h3>
        <a href="#" className="view-all-link">View All →</a>
      </div>
      <p className="card-subtitle">An overview of your most recent orders.</p>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Ensure the 'key' prop is of type string. */}
          {orders.map((order: Order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;