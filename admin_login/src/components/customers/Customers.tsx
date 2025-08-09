import React, { useState, useEffect } from 'react';
import './Customers.css';
import CustomerModal from './CustomerModal.tsx';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  joinedAt: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
  }, []);

  const handleAddCustomer = (customer: Customer) => {
    let updated: Customer[];
    if (editingCustomer) {
      updated = customers.map((c) => (c.id === customer.id ? customer : c));
      setEditingCustomer(null);
    } else {
      updated = [...customers, customer];
    }
    setCustomers(updated);
    localStorage.setItem('customers', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    localStorage.setItem('customers', JSON.stringify(updated));
    setMenuOpen(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
    setMenuOpen(null);
  };

  const exportToCSV = () => {
    const csvContent =
      'ID,Name,Email,Phone,Company,Joined At\n' +
      customers
        .map((c) =>
          [c.id, c.name, c.email, c.phone, c.company, c.joinedAt]
            .map((field) => `"${field}"`).join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div>
          <h2>Customers</h2>
          <p>View and manage your customer records.</p>
        </div>
        <div className="customers-actions">
          <button onClick={exportToCSV} className="export-btn">Export CSV</button>
          <button onClick={() => { setShowModal(true); setEditingCustomer(null); }} className="add-customer-btn">
            Add New Customer
          </button>
        </div>
      </div>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th><th>Company</th><th>Phone</th><th>Joined At</th><th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
                <div className="customer-email">{c.email}</div>
              </td>
              <td>{c.company}</td>
              <td>{c.phone}</td>
              <td>{c.joinedAt}</td>
              <td className="menu-cell">
                <button onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)} className="menu-btn">⋯</button>
                {menuOpen === c.id && (
                  <div className="dropdown-menu">
                    <div onClick={() => handleEdit(c)}>✏️ Edit</div>
                    <div onClick={() => handleDelete(c.id)}>🗑️ Delete</div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <CustomerModal
          onClose={() => { setShowModal(false); setEditingCustomer(null); }}
          onAdd={handleAddCustomer}
          editData={editingCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
