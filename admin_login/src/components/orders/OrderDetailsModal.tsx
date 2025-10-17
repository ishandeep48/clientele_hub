import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modals.css";

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  orderId: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  product?: string;
  productName?: string;
  items?: number;
  itemCount?: number;
  itemsList?: OrderItem[];
  total: number;
  status: string;
  date?: string;
  orderDate?: string;
  adminResponse?: string;
  productDetails?: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

interface Props {
  order: { orderId: string };
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, isOpen, onClose }: Props) => {
  const [orderDetails, setOrderDetails] = useState(null as OrderDetails | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails();
    }
  }, [isOpen, order]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://clientele-hub.onrender.com/admin/orders/${order.orderId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Order Details - {order.orderId}</h3>
        {loading && <div className="loading">Loading order details...</div>}
        {error && <div className="error">{error}</div>}
        {orderDetails && (
          <>
            <div className="order-details-grid">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> <span>{orderDetails.customer?.name || orderDetails.customerName || 'N/A'}</span></p>
                <p><strong>Email:</strong> <span>{orderDetails.customer?.email || orderDetails.customerEmail || 'N/A'}</span></p>
                <p><strong>Phone:</strong> <span>{orderDetails.customer?.phone || orderDetails.customerPhone || 'N/A'}</span></p>
              </div>
              <div className="detail-section">
                <h4>Order Summary</h4>
                <p><strong>Products:</strong> <span>{orderDetails.product || orderDetails.productName || 'N/A'}</span></p>
                <p><strong>Items:</strong> <span>{orderDetails.items || orderDetails.itemCount || orderDetails.itemsList?.length || 0}</span></p>
                <p><strong>Total:</strong> <span>₹{orderDetails.total?.toLocaleString() || 'N/A'}</span></p>
                <p><strong>Status:</strong> <span className={`status-badge ${orderDetails.status?.toLowerCase()}`}>{orderDetails.status || 'N/A'}</span></p>
                <p><strong>Date:</strong> <span>{new Date(orderDetails.date || orderDetails.orderDate || Date.now()).toLocaleDateString() || 'N/A'}</span></p>
                <p><strong>Payment:</strong> <span>{orderDetails.paymentMethod || 'N/A'}</span></p>
              </div>
              <div className="detail-section">
                <h4>Products</h4>
                {orderDetails.itemsList && orderDetails.itemsList.length > 0 ? (
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.itemsList.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.product}</td>
                          <td>{it.quantity}</td>
                          <td>₹{Number(it.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No product line items.</p>
                )}
              </div>
              <div className="detail-section">
                <h4>Shipping Address</h4>
                <p>{orderDetails.shippingAddress || 'No shipping address provided.'}</p>
              </div>
              {orderDetails.adminResponse && (
                <div className="detail-section">
                  <h4>Admin Response</h4>
                  <p>{orderDetails.adminResponse}</p>
                </div>
              )}
            </div>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;
