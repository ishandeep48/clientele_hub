// src/components/payments/Payments.tsx
import React, { useState, useEffect } from 'react';
import "./Payments.css";
import PaymentModals from './PaymentModals.tsx';
import axios from 'axios'

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // const stored = JSON.parse(localStorage.getItem('payments') || '[]');
    // setPayments(stored);
    // console.log(stored);
    const getdata = async()=>{
      const res = await axios.get('https://clientele-hub.onrender.com/admin/payments/all');
      const stored = res.data;
      console.log(stored)
      setPayments(stored);
    }
    getdata();
  }, []);

  const handleView = (payment: any) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleExportCSV = () => {
    const headers = ['Payment ID', 'Order ID', 'Customer', 'Method', 'Amount', 'Date'];
    const rows = payments.map((p) =>
      [p.Paymentid, p._id, p.orderedBy||"koi set rn", p.method, p.price, p.date]
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
Payment ID: ${payment.Paymentid}
Order ID: ${payment._id}
Customer: ${payment.orderedBy || "null hai"}
Method: ${payment.method}
Amount: ₹${payment.price}
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
            <tr key={payment._id}>
              <td>{payment.Paymentid}</td>
              <td>{payment._id}</td>
              <td>{payment.orderedBy?.name || payment.orderedBy || "null customer"}</td>
              <td>{payment.method}</td>
              <td>₹{payment.price}</td>
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
