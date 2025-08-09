import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import OrderDetailsModal from "./OrderDetailsModal.tsx";
import AcknowledgeOrderModal from "./AcknowledgeOrderModal.tsx";

interface Order {
  id: string;
  customerName: string;
  productName: string;
  itemCount: number;
  total: number;
  status: 'Pending' | 'Acknowledged' | 'Cancelled';
  orderDate: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAcknowledgeOpen, setIsAcknowledgeOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("clientOrders");
    const parsed = stored ? JSON.parse(stored) : [];
    setOrders(parsed);
  }, []);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleAcknowledge = (order: Order) => {
    setSelectedOrder(order);
    setIsAcknowledgeOpen(true);
  };

const handleAcknowledgeConfirm = (orderId: string, response: string) => {
  const updated = orders.map((o) =>
    o.id === orderId
      ? { ...o, status: "Acknowledged", adminResponse: response }
      : o
  );

  setOrders(updated);
  localStorage.setItem("clientOrders", JSON.stringify(updated));

  const confirmed = JSON.parse(localStorage.getItem("confirmedOrders") || "[]");
  const acknowledgedOrder = updated.find(o => o.id === orderId);
  if (acknowledgedOrder) {
    localStorage.setItem(
      "confirmedOrders",
      JSON.stringify([...confirmed, acknowledgedOrder])
    );
  }
};

  return (
    <div className="admin-orders-container">
      <h2>Client Order Requests</h2>
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Total</th>
            <th>Items</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8}>No orders yet</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>₹{order.total}</td>
                <td>{order.itemCount}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleView(order)}>View</button>
                  {order.status === "Pending" && (
                    <button onClick={() => handleAcknowledge(order)}>Acknowledge</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}

      {selectedOrder && (
        <AcknowledgeOrderModal
          order={selectedOrder}
          isOpen={isAcknowledgeOpen}
          onClose={() => setIsAcknowledgeOpen(false)}
          onAcknowledge={handleAcknowledgeConfirm}
        />
      )}
    </div>
  );
};

export default AdminOrders;
