import React, { useEffect, useState } from 'react';
import './Billing.css';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Due';
}

const Billing = () => {
  const [invoices, setInvoices] = useState([] as Invoice[]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [isPayingAll, setIsPayingAll] = useState(false);

  const loadInvoices = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch('https://clientele-hub.onrender.com/user/billing', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) return;
      setInvoices(data as Invoice[]);
      const totalDue = (data as Invoice[])
        .filter(inv => inv.status === 'Due')
        .reduce((sum, inv) => sum + inv.amount, 0);
      setOutstandingBalance(totalDue);
    } catch (e) {}
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePay = async (id: string) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`https://clientele-hub.onrender.com/user/billing/${id}/pay`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      await loadInvoices();
    } catch (e) {}
  };

  const handlePayAll = async () => {
    if (isPayingAll) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;
    const due = invoices.filter(inv => inv.status === 'Due');
    if (due.length === 0) return;
    setIsPayingAll(true);
    try {
      for (const inv of due) {
        const res = await fetch(`https://clientele-hub.onrender.com/user/billing/${inv.id}/pay`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
        // if any fails, continue to try others
      }
      await loadInvoices();
    } catch (e) {
    } finally {
      setIsPayingAll(false);
    }
  };

  return (
    <div className="billing-container">
      <h1 className="billing-title">Billing & Payments</h1>
      <p className="billing-subtitle">View invoices and make payments.</p>

      <div className="billing-summary">
        <div className="billing-card">
          <h2 className="billing-heading">Outstanding Balance</h2>
          <p className="billing-description">Your current account balance.</p>
          <p className="billing-price">₹{outstandingBalance.toFixed(2)}</p>
          {outstandingBalance > 0 && (
            <button className="btn-primary mt" onClick={handlePayAll} disabled={isPayingAll}>
              {isPayingAll ? 'Processing...' : 'Pay Now'}
            </button>
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
                <td>₹{inv.amount.toFixed(2)}</td>
                <td>
                  <span className={`badge ${inv.status === 'Paid' ? 'badge-paid' : 'badge-due'}`}>
                    {inv.status}
                  </span>
                </td>
                 <td>
                  {inv.status === 'Due' ? (
                    <button className="btn-sm btn-primary" onClick={() => handlePay(inv.id)}>Pay Now</button>
                  ) : <p>DONE</p>}
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
