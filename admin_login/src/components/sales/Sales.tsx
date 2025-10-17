import React, { useState, useEffect } from "react";
import "./Sales.css";
import AddSalesModal from "./AddSalesModal.tsx";
import ViewSalesModal from "./ViewSalesModal.tsx";
import axios from "axios";

const Sales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);

  useEffect(() => {
    // const storedSales = JSON.parse(localStorage.getItem("sales") || "[]");
    // //
    // setSales(storedSales);
    const getData = async()=>{
      const res=await axios.get('/admin/sales/all');
      const stored = res.data;
      setSales(stored);
    }
    getData()
  }, []);

  const handleAddSale = (sale: any) => {
    const updatedSales = [...sales, sale];
    setSales(updatedSales);
  };

  const handleEditSale = (updatedSale: any) => {
    const updatedSales = sales.map((s) =>
      s.id === updatedSale.id ? updatedSale : s
    );
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));
  };

  const handleDeleteSale = async(id: string) => {
    console.log(id)
    const res = await axios.delete('/admin/sales/delete',{data:{id}});
    console.log(res);
    if(res.data.message=="done")
    {const updatedSales = sales.filter((s) => s.salesid !== id);
    setSales(updatedSales);}

  };

  const exportToCSV = () => {
    const headers = ["Product", "Amount", "Date", "Salesperson"];
    const rows = sales.map((sale) => [
      sale.prodId.pid,
      sale.amount,
      sale.date,
      sale.salesPerson.name,
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
            <tr key={sale.salesid}>
              <td>{sale.prodId.pid}</td>
              <td>INR {sale.amount}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>{sale.salesPerson.name}</td>
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
                  onClick={() => handleDeleteSale(sale.salesid)}
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
