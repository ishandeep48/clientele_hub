import React, { useState } from "react";
import "./Modals.css";

const AcknowledgeOrderModal = ({ order, isOpen, onClose, onAcknowledge }) => {
  const [response, setResponse] = useState("");

  if (!isOpen || !order) return null;

  const handleSubmit = () => {
    onAcknowledge(order.id, response);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Acknowledge Order - {order.id}</h3>
        <textarea
          placeholder="Write your response..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Acknowledge</button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgeOrderModal;
