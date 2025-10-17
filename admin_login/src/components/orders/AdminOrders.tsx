import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrders.css";
import OrderDetailsModal from "./OrderDetailsModal.tsx";
import AcknowledgeOrderModal from "./AcknowledgeOrderModal.tsx";

interface Order {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  product: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Shipped';
  total: number;
  items: number;
  date: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAcknowledgeOpen, setIsAcknowledgeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/admin/orders/getall');
      // Ensure orders is always an array
      console.log(response.data);
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleAcknowledge = (order: Order) => {
    setSelectedOrder(order);
    setIsAcknowledgeOpen(true);
  };

const handleAcknowledgeConfirm = async (orderId: string, response: string) => {
  try {
    await axios.put(`/admin/orders/${orderId}/acknowledge`, {
      adminResponse: response
    });
    fetchOrders(); // Refresh the list
  } catch (error) {
    console.error('Error acknowledging order:', error);
  }
};

  const seedOrders = async () => {
    try {
      await axios.post('/admin/orders/seed');
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error seeding orders:', error);
    }
  };

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h2>Client Order Requests</h2>
        <button className="seed-btn" onClick={seedOrders}>
          Seed Sample Data
        </button>
      </div>

      {loading && <div className="loading">Loading orders...</div>}
      {error && <div className="error">{error}</div>}

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
          {!Array.isArray(orders) || orders.length === 0 ? (
            <tr>
              <td colSpan={8}>No orders yet</td>
            </tr>
          ) : (
                         orders.map((order) => (
               <tr key={order.orderId}>
                 <td>{order.orderId}</td>
                 <td>{order.customer.name}</td>
                 <td>{order.product}</td>
                 <td>
                   <span className={`status-badge ${order.status.toLowerCase()}`}>
                     {order.status}
                   </span>
                 </td>
                 <td>₹{order.total}</td>
                 <td>{order.items}</td>
                 <td>{new Date(order.date).toLocaleDateString()}</td>
                 <td>
                   <button onClick={() => handleView(order)}>View</button>
                   {order.status === "Pending" && (
                     <button onClick={() => handleAcknowledge(order)}>Complete</button>
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
