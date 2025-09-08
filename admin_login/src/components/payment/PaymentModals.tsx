// src/components/payments/PaymentModal.tsx
import React from 'react';
import './Payments.css';

const PaymentModal = ({ payment, onClose }: any) => {
  if (!payment) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3>Payment Details</h3>
        <p><strong>Payment ID:</strong> {payment.Paymentid}</p>
        <p><strong>Order ID:</strong> {payment._id}</p>
        <p><strong>Customer:</strong> {payment.orderedBy?.name || "null rn"}</p>
        <p><strong>Method:</strong> {payment.method}</p>
        <p><strong>Amount:</strong> ₹{payment.price}</p>
        <p><strong>Date:</strong> {payment.date}</p>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button onClick={() => alert("Refund logic pending...")}>Issue Refund</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
