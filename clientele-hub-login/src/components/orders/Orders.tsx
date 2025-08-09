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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sampleOrders: Order[] = [
    {
      id: 'ORD-2024-001',
      name: 'Premium Website Design',
      date: '2024-07-15',
      total: 250000,
      status: 'Shipped',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123456',
    },
    {
      id: 'ORD-2024-002',
      name: 'Business Cards (x500)',
      date: '2024-07-10',
      total: 150000,
      status: 'Delivered',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123457',
    },
    {
      id: 'ORD-2024-003',
      name: 'Social Media Graphics Pack',
      date: '2024-07-05',
      total: 350000,
      status: 'Processing',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123458',
    },
    {
      id: 'ORD-2024-004',
      name: 'SEO Audit & Report',
      date: '2024-06-28',
      total: 450000,
      status: 'Delivered',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123459',
    },
    {
      id: 'ORD-2024-005',
      name: 'Consultation Hour',
      date: '2024-06-20',
      total: 550000,
      status: 'Cancelled',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123460',
    },
    {
      id: 'ORD-2024-006',
      name: 'Website Maintenance',
      date: '2024-06-15',
      total: 200000,
      status: 'Delivered',
      items: [],
      shippingAddress: '',
      tracking: 'TRK123461',
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const storedOrders = JSON.parse(localStorage.getItem('orders') || 'null');
    if (storedOrders && storedOrders.length > 0) {
      setOrders(storedOrders);
    } else {
      setOrders(sampleOrders);
      localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
    setIsLoading(false);
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
                  <td>{formatCurrency(order.total)}</td>
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
