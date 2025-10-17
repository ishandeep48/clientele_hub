import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import OrdersChart from "./charts/OrdersChart.tsx";
import SalesChart from "./charts/SalesChart.tsx";
import PaymentsChart from "./charts/PaymentsChart.tsx";
import LeadsVsCustomersChart from "./charts/LeadsVsCustomersChart.tsx";
import FeedbackSentimentChart from "./charts/FeedbackSentimentChart.tsx";
import axios from "axios";

const Dashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [graphData, setGraphData] = useState({});
  const [orderGraph,setOrderGraph]=useState([]);
  const [salesGraph,setSalesGraph]=useState([]);
  const [paymentGraph,setPaymentGraph] =useState([]);
  const [feedbackGraph,setFeedbackGraph] =useState([]);
  const [lvcGraph,setLVCGraph] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/admin/orders/all");
      if (result.data.message == "No orders found") {
        console.log("NO ORDER HAI JI");
      }
      // Sales Module
      setTotalSales(result.data.totalSales);
      // console.log(result.data);
      setTotalRevenue(result.data.totalRevenue);

      // Customers Module
      setTotalCustomers(result.data.totalCustomers);

      // Orders Module
      setPendingOrders(result.data.pendingOrders);

      setOrderGraph(result.data.orderOverview)
      setSalesGraph(result.data.salesOverviewArray)
      setPaymentGraph(result.data.paymentOverview)
      setFeedbackGraph(result.data.feedbackSentiment)
      setLVCGraph(result.data.leadVScustArray)
      
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <h1>Dashboard</h1>
        <button className="download-button">
          <i className="download-icon" /> Download Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h4>Total Revenue</h4>
          <h2>₹{totalRevenue.toFixed(2)}</h2>
          <p>Based on all sales</p>
        </div>
        <div className="card">
          <h4>Total Customers</h4>
          <h2>{totalCustomers}</h2>
          <p>All-time customer count</p>
        </div>
        <div className="card">
          <h4>Sales</h4>
          <h2>{totalSales}</h2>
          <p>Total number of sales transactions</p>
        </div>
        <div className="card">
          <h4>Pending Orders</h4>
          <h2>{pendingOrders}</h2>
          <p>Orders awaiting processing</p>
        </div>
      </div>

      {/* Charts Section */}
      <h2 className="section-title">Analytics Overview</h2>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Orders Overview</h3>
          <OrdersChart chartData={orderGraph} />
        </div>
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <SalesChart salesGraph={salesGraph}/>
        </div>
        <div className="chart-card">
          <h3>Payments Overview</h3>
          <PaymentsChart paymentGraph={paymentGraph} />
        </div>
        <div className="chart-card">
          <h3>Leads vs Customers</h3>
          <LeadsVsCustomersChart lvcGraph={lvcGraph} />
        </div>
        <div className="chart-card">
          <h3>Feedback Sentiment</h3>
          <FeedbackSentimentChart feedbackGraph={feedbackGraph} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
