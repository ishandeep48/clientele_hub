import React from "react";
import "./AddSalesModal.css";

interface Props {
  sale: any;
  onClose: () => void;
}

const ViewSalesModal: React.FC<Props> = ({ sale, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Sale Details</h3>
        <p><strong>Product:</strong> {sale.prodId.pid}</p>
        <p><strong>Amount:</strong> {sale.amount}</p>
        <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
        <p><strong>Salesperson:</strong> {sale.salesPerson.name}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewSalesModal;
