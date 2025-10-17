import React, { useState, useEffect } from "react";
import "./AddSalesModal.css";
import axios from "axios";

interface Props {
  sale: any;
  onClose: () => void;
  onSave: (sale: any) => void;
}

const AddSalesModal: React.FC<Props> = ({ sale, onClose, onSave }) => {

  const [form, setForm] = useState({
    id: sale?.salesid || "",
    product: sale?.prodId.pid || "",
    amount: sale?.amount || "",
    date: sale?.date || "",
    salesperson: sale?.salesPerson.name || "",
  });

  useEffect(() => {
    if (sale) setForm(sale);
    else setForm({ id: "", product: "", amount: "", date: "", salesperson: "" });
  }, [sale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('test', e.target.value)
    setForm({ ...form, [e.target.name]: new Date(e.target.value) });
  };


  const handleSubmit = async () => {
    console.log(form);
    console.log("sale is ",sale)
    if (!sale) {
      const res = await axios.post('/admin/sales/new', form);
      console.log("THIS IS ",res.data.message)
      if (res.data.message == 'done') {
        window.location.reload();
      }
    } else {
      console.log(form)
      const res = await axios.post('/admin/sales/edit', form);
      console.log(res.data.message)
      if (res.data.message == 'done') {
        window.location.reload();
      }
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{sale ? "Edit Sale" : "Add Sale"}</h3>
        <div className="form-group">
          <label>Product</label>
          {/* {console.log("hehe",form.date)} */}
          <input name="product" value={form.product} placeholder="Enter the Product ID" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input name="amount" value={form.amount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input name="date" type="date" value={form.date ? new Date(form.date).toISOString().split("T")[0] : ""} onChange={handleDateChange} />
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
