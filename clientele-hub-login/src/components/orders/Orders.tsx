import React, { useState, useEffect } from 'react';
import './Orders.css';
import CreateOrderModal from './CreateOrderModal.tsx';
import OrderDetailsModal from './OrderDetailsModal.tsx';

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  name: string;
  date: string;
  total: number;
  status: 'Shipped' | 'Delivered' | 'Processing' | 'Cancelled';
  items: OrderItem[];
  shippingAddress: string;
  tracking: string;
}

interface NewOrderData {
  clientInfo: any;
  shippingAddress: any;
  orderItems: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState([] as Order[]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null as Order | null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        setOrders([]);
        setIsLoading(false);
        return;
      }
      const res = await fetch('https://clientele-hub.onrender.com/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setOrders([]);
      } else {
        setOrders(data as Order[]);
      }
    } catch (e) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const formatCurrency = (amount: number): string => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="orders-container">
      <header className="orders-header">
        <h1>Orders</h1>
        <p className="subtitle">Check the status of recent and past orders.</p>
      </header>

      <section className="order-history">
        <div className="section-header">
          <h2>Order History</h2>
          <p>A list of all your orders with us.</p>
          <button className="create-order-btn" onClick={() => setShowCreateModal(true)}>
            + Create Order
          </button>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.date}</td>
                  <td>₹{order.total}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => setSelectedOrder(order)}>
                      👁
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadOrders();
          }}
          // onCreate={addOrder}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
