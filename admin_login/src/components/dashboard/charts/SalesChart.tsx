// src/components/dashboard/charts/SalesChart.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const totals = sales.reduce((acc: any, curr: any) => {
      const date = new Date(curr.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + parseFloat(curr.amount || 0);
      return acc;
    }, {});
    const chartData = Object.keys(totals).map(date => ({ date, amount: totals[date] }));
    setData(chartData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
