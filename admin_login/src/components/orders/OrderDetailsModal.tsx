import React from "react";
import "./Modals.css";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Order Details - {order.id}</h3>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Product:</strong> {order.productName}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Items:</strong> {order.itemCount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
        {order.adminResponse && (
          <p><strong>Admin Response:</strong> {order.adminResponse}</p>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
