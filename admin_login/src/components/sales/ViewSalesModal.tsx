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
        <p><strong>Product:</strong> {sale.product}</p>
        <p><strong>Amount:</strong> {sale.amount}</p>
        <p><strong>Date:</strong> {sale.date}</p>
        <p><strong>Salesperson:</strong> {sale.salesperson}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewSalesModal;
