import React from "react";
import "./ViewBillModal.css";

interface Bill {
  id: string;
  customer: string;
  orderId: string;
  billDate: string;
  dueDate: string;
  status: string;
  totalAmount: string;
  gst: string;
}

interface ViewBillModalProps {
  bill: Bill | null;
  onClose: () => void;
}

const ViewBillModal: React.FC<ViewBillModalProps> = ({ bill, onClose }) => {
  if (!bill) return null;

  return (
    <div className="view-bill-overlay">
      <div className="view-bill-modal">
        <h2>View Bill Details</h2>
        <div className="view-bill-content">
          <p><strong>Bill ID:</strong> {bill.id}</p>
          <p><strong>Customer:</strong> {bill.customer}</p>
          <p><strong>Order ID:</strong> {bill.orderId}</p>
          <p><strong>Bill Date:</strong> {bill.billDate}</p>
          <p><strong>Due Date:</strong> {bill.dueDate}</p>
          <p><strong>Status:</strong> {bill.status}</p>
          <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
          <p><strong>GST:</strong> ₹{bill.gst}</p>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewBillModal;
