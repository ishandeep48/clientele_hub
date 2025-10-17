// CreateOrderModal.tsx
import React, { useState } from 'react';
import './CreateOrderModal.css';

interface CreateOrderModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

interface OrderItem {
  product: string;
  qty: number;
  price: number;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ onClose, onCreated }) => {
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    email: '',
    clientId: '',
  });

  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [items, setItems] = useState<OrderItem[]>([
    { product: '', qty: 1, price: 0 },
  ]);

  const [paymentMode, setPaymentMode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const updated = [...items];
    updated[index][field] = field === 'qty' || field === 'price' ? Number(value) : value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const getOrderTotal = () => {
    return items.reduce((total, item) => total + item.qty * item.price, 0);
  };

  const handleSave = async () => {
    if (!clientInfo.clientName || !clientInfo.email || items.length === 0) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const token = localStorage.getItem('userToken');
      const total = getOrderTotal();
      const res = await fetch('https://clientele-hub.onrender.com/user/orders/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          total, 
          paymentMode,
          items,
          address,
          notes: orderNotes,
          clientInfo
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error || 'Failed to create order');
        return;
      }
      onClose();
      if (onCreated) onCreated();
    } catch (e) {
      alert('Something went wrong');
    }
  };

  return (
    <div className="modal-overlay vss">
      <div className="modal-box">
        <h2 className="modal-title">Create New Order</h2>

        <h3>Client Information</h3>
        <div className="modal-field">
          <input name="clientName" placeholder="Client Name" value={clientInfo.clientName} onChange={handleClientChange} />
          <input type='email' name="email" placeholder="Email" value={clientInfo.email} onChange={handleClientChange} />
          <input name="clientId" placeholder="Client ID" value={clientInfo.clientId} onChange={handleClientChange} />
        </div>

        <h3>Shipping Address</h3>
        <div className="modal-field">
          <input name="line1" placeholder="Address Line 1" value={address.line1} onChange={handleAddressChange} />
          <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} />
          <input name="state" placeholder="State / Province" value={address.state} onChange={handleAddressChange} />
<input
  type="number"
  name="postalCode"
  placeholder="Postal Code"
  value={address.postalCode}
  onChange={(e) => {
    const value = e.target.value;
    if (value.length <= 6) {
      handleAddressChange(e);
    }
  }}
/>
          <input name="country" placeholder="Country" value={address.country} onChange={handleAddressChange} />
        </div>

        <h3>Order Items</h3>
        {items.map((item, index) => (
          <div key={index} className="modal-field item-row">
            <input
              placeholder="Product"
              value={item.product}
              onChange={(e) => handleItemChange(index, 'product', e.target.value)}
            />
<span align='left'>Quantity</span>
            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
            />
<span className="text-left block">Price</span>
            {/* <h3>Price</h3> */}
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            />
            <button onClick={() => removeItem(index)}>🗑️</button>
          </div>
        ))}
        <button onClick={addItem}>➕ Add Item</button>

        <h3>Payment & Status</h3>
        <div className="modal-field">
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="">Select Payment Mode</option>
            <option value="Net">Net</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
          <textarea
            placeholder="Add order notes..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <div className="order-total">Order Total: ₹{getOrderTotal().toFixed(2)}</div>
          <div className="modal-actions">
            <button onClick={handleSave} className="save-btn">Create Order</button>
            <button onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;

