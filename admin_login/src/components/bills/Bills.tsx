import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./Bills.css";

interface Bill {
  id: string;
  customer: string;
  orderId: string;
  billDate: string;
  dueDate: string;
  status: string;
  totalAmount: number;
  gst: number;
}

const Bills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://clientele-hub.onrender.com/admin/bills/all");
        const data = Array.isArray(res.data) ? res.data : [];
        setBills(data);
      } catch (e) {
        console.error("Failed to fetch bills", e);
        setError("Failed to fetch bills");
        setBills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const handleDownloadPDF = async (bill: Bill) => {
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "'Segoe UI', sans-serif";
    element.innerHTML = `
      <h2>Bill ID: ${bill.id}</h2>
      <p><strong>Customer:</strong> ${bill.customer}</p>
      <p><strong>Order ID:</strong> ${bill.orderId}</p>
      <p><strong>Bill Date:</strong> ${bill.billDate}</p>
      <p><strong>Due Date:</strong> ${bill.dueDate}</p>
      <p><strong>Status:</strong> ${bill.status}</p>
      <p><strong>Total Amount:</strong> ₹${bill.totalAmount}</p>
      <p><strong>GST:</strong> ₹${bill.gst}</p>
    `;
    document.body.appendChild(element);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Bill-${bill.id}.pdf`);

    document.body.removeChild(element);
  };

  const handleViewBill = (bill: Bill) => {
    alert(`Viewing bill for Order ID: ${bill.orderId}`);
  };

  return (
    <div className="bills-container">
      <h1 className="bills-heading">
        <strong>Bills</strong>{" "}
        <span className="bills-subtext">Manage and track customer invoices.</span>
      </h1>

      {loading && (
        <div style={{ padding: "1rem", color: "#6b7280" }}>Loading bills...</div>
      )}
      {error && (
        <div style={{ padding: "1rem", color: "#dc2626" }}>{error}</div>
      )}

      <div className="bills-table-wrapper">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Bill Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>GST</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.customer}</td>
                <td>{bill.orderId}</td>
                <td>{bill.billDate}</td>
                <td>{bill.dueDate}</td>
                <td>
                  <span className={`badge ${bill.status.toLowerCase()}`}>
                    {bill.status}
                  </span>
                </td>
                <td>₹{bill.totalAmount}</td>
                <td>₹{bill.gst}</td>
                <td>
                  {/* <button className="view-btn" onClick={() => handleViewBill(bill)}>
                    View
                  </button> */}
                  <button className="download-btn" onClick={() => handleDownloadPDF(bill)}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>
                  No bills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bills;
