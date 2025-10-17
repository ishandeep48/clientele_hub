import React from 'react';
import './OrderDetailsModal.css';

// Define the interface for an individual order item.
interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

// Define the interface for the entire order object.
interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  tracking: string;
}

// Define the props for the OrderDetailsModal component.
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  return (
    <div className="modal-overlay">
      <div className="order-details-modal">
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p className="order-description">
            A detailed summary of order #{order.id}
          </p>

          <div className="order-info">
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value">{order.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{order.date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className={`info-value status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: OrderItem, index: number) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="order-total">
            <strong>Total: ₹{order.total.toFixed(2)}</strong>
          </div>

          <div className="divider"></div>

          <h3>Shipping Address</h3>
          <p className="shipping-address">{order.shippingAddress}</p>

          <div className="tracking-info">
            <span className="info-label">Tracking Information</span>
            <span className="info-value">{order.tracking || '—'}</span>
          </div>

          <div className="action-buttons">
            <button className="download-btn">Download Invoice</button>
            <button className="cancel-btn">Request Cancellation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;