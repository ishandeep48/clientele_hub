import React, { useState, useEffect } from "react";
import "./AddSalesModal.css";

interface Props {
  sale: any;
  onClose: () => void;
  onSave: (sale: any) => void;
}

const AddSalesModal: React.FC<Props> = ({ sale, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: "",
    product: "",
    amount: "",
    date: "",
    salesperson: "",
  });

  useEffect(() => {
    if (sale) setForm(sale);
    else setForm({ id: crypto.randomUUID(), product: "", amount: "", date: "", salesperson: "" });
  }, [sale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{sale ? "Edit Sale" : "Add Sale"}</h3>
        <div className="form-group">
          <label>Product</label>
          <input name="product" value={form.product} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input name="amount" value={form.amount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Salesperson</label>
          <input name="salesperson" value={form.salesperson} onChange={handleChange} />
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSubmit}>
            {sale ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSalesModal;
