import React, { useState } from "react";
import './CreateLeadModal.css';

interface CreateLeadModalProps {
  onClose: () => void;
  onSave: (lead: any) => void;
  initialData?: any; // Used for editing
}

const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [status, setStatus] = useState(initialData?.status || 'New');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLead = {
      id: initialData?.id || Date.now().toString(),
      name,
      email,
      status,
    };

    onSave(newLead);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Edit Lead' : 'Create Lead'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="New">New</option>
              <option value="Connected">Connected</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit">{initialData ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;
