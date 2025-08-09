import React, { useState, useEffect } from 'react';
import { Product } from './Products.tsx';
import './AddProductModal.css';

interface Props {
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData: Product | null;
}

const AddProductModal = ({ onClose, onSave, initialData }: Props) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    image: '',
    price: '',
    stock: '',
    gst: '',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        name: initialData.name,
        category: initialData.category,
        image: initialData.image || '',
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        gst: initialData.gst.toString(),
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const product: Product = {
      id: form.id || Date.now().toString(),
      name: form.name,
      category: form.category,
      image: form.image,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      gst: parseFloat(form.gst),
      status: form.status as 'Active' | 'Inactive',
    };
    onSave(product);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{form.id ? 'Edit Product' : 'Add New Product'}</h3>
        <p>Fill in the details below to {form.id ? 'update' : 'create'} a product.</p>

        <input type="text" placeholder="e.g., Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="text" placeholder="e.g., Software" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="file" onChange={handleFile} />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input type="number" placeholder="GST (%)" value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button onClick={handleSubmit}>{form.id ? 'Update' : 'Save'} Product</button>
        <button className="cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddProductModal;
