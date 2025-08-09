import React, { useState, useEffect } from "react";
import "./Sales.css";
import AddSalesModal from "./AddSalesModal.tsx";
import ViewSalesModal from "./ViewSalesModal.tsx";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);

  useEffect(() => {
    const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    setSales(storedSales);
  }, []);

  const handleAddSale = (sale: any) => {
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  };

  const handleEditSale = (updatedSale: any) => {
    const updatedSales = sales.map((s) =>
      s.id === updatedSale.id ? updatedSale : s
    );
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  };

  const handleDeleteSale = (id: string) => {
    const updatedSales = sales.filter((s) => s.id !== id);
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  };

  const exportToCSV = () => {
    const headers = ["Product", "Amount", "Date", "Salesperson"];
    const rows = sales.map((sale) => [
      sale.product,
      sale.amount,
      sale.date,
      sale.salesperson,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h2>Sales</h2>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="add-btn">
            Add Sale
          </button>
          <button onClick={exportToCSV} className="export-btn">
            Export to CSV
          </button>
        </div>
      </div>
      <table className="sales-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Salesperson</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.product}</td>
              <td>{sale.amount}</td>
              <td>{sale.date}</td>
              <td>{sale.salesperson}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => {
                    setCurrentSale(sale);
                    setIsViewModalOpen(true);
                  }}
                >
                  View
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    setCurrentSale(sale);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteSale(sale.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AddSalesModal
          sale={currentSale}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentSale(null);
          }}
          onSave={(data) => {
            currentSale ? handleEditSale(data) : handleAddSale(data);
            setIsModalOpen(false);
            setCurrentSale(null);
          }}
        />
      )}

      {isViewModalOpen && currentSale && (
        <ViewSalesModal
          sale={currentSale}
          onClose={() => {
            setIsViewModalOpen(false);
            setCurrentSale(null);
          }}
        />
      )}
    </div>
  );
};

export default Sales;
