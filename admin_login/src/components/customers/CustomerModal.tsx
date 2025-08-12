import React, { useState , useEffect } from 'react';
import './Customers.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  joinedAt: string;
}

interface Props {
  onClose: () => void;
  onAdd: (customer: Customer) => void;
  editData?: Customer | null;
}

const CustomerModal: React.FC<Props> = ({ onClose, onAdd, editData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) return;

    const newCustomer: Customer = {
      ...formData,
      id: editData ? editData.id : '',
      joinedAt: editData ? editData.joinedAt : new Date().toLocaleDateString(),
    };
    onAdd(newCustomer);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{editData ? 'Edit Customer' : 'Add New Customer'}</h3>
        <p>Fill in the details below to {editData ? 'update' : 'create'} the customer.</p>
        
        <input name="name" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input name="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        <input name="company" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />

        <div className="modal-actions">
          <button onClick={handleSubmit} className="add-btn">
            {editData ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
    </div>
  );
};


export default CustomerModal;
