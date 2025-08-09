import React, { useEffect, useState } from 'react';
import './Billing.css';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Due';
}

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  useEffect(() => {
    const localInvoices = JSON.parse(localStorage.getItem('billingInvoices') || '[]');
    setInvoices(localInvoices);

    const dueInvoices = localInvoices.filter((inv: Invoice) => inv.status === 'Due');
    const totalDue = dueInvoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
    setOutstandingBalance(totalDue);
  }, []);

  const handlePay = (id: string) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv);
    localStorage.setItem('billingInvoices', JSON.stringify(updated));
    setInvoices(updated);
  };

  return (
    <div className="billing-container">
      <h1 className="billing-title">Billing & Payments</h1>
      <p className="billing-subtitle">View invoices and make payments.</p>

      <div className="billing-summary">
        <div className="billing-card">
          <h2 className="billing-heading">Outstanding Balance</h2>
          <p className="billing-description">Your current account balance.</p>
          <p className="billing-price">${outstandingBalance.toFixed(2)}</p>
          {outstandingBalance > 0 && (
            <button className="btn-primary mt">Pay Now</button>
          )}
        </div>
      </div>

      <div className="billing-history">
        <h2 className="billing-heading">Invoice History</h2>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.date}</td>
                <td>${inv.amount.toFixed(2)}</td>
                <td>
                  <span className={`badge ${inv.status === 'Paid' ? 'badge-paid' : 'badge-due'}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  {inv.status === 'Due' ? (
                    <button className="btn-sm btn-primary" onClick={() => handlePay(inv.id)}>Pay Now</button>
                  ) : (
                    <button className="btn-sm btn-secondary">Download</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
