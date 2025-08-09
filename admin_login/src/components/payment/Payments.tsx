// src/components/payments/Payments.tsx
import React, { useState, useEffect } from 'react';
import "./Payments.css";
import PaymentModals from './PaymentModals.tsx';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(stored);
  }, []);

  const handleView = (payment: any) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleExportCSV = () => {
    const headers = ['Payment ID', 'Order ID', 'Customer', 'Method', 'Amount', 'Date'];
    const rows = payments.map((p) =>
      [p.id, p.orderId, p.customer, p.method, p.amount, p.date]
    );

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'payments.csv';
    link.click();
  };

  const downloadPayment = (payment: any) => {
    const content = `
Payment Receipt
----------------------
Payment ID: ${payment.id}
Order ID: ${payment.orderId}
Customer: ${payment.customer}
Method: ${payment.method}
Amount: ₹${payment.amount}
Date: ${payment.date}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payment_${payment.id}.txt`;
    link.click();
  };

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>Payments</h2>
        <button onClick={handleExportCSV}>Export to CSV</button>
      </div>
      <table className="payments-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.orderId}</td>
              <td>{payment.customer}</td>
              <td>{payment.method}</td>
              <td>₹{payment.amount}</td>
              <td>{payment.date}</td>
              <td>
                <button onClick={() => handleView(payment)}>View</button>
                <button onClick={() => downloadPayment(payment)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <PaymentModals
          payment={selectedPayment}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Payments;
