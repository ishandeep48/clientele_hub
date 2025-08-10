// src/components/dashboard/charts/SalesChart.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({salesGraph}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!Array.isArray(salesGraph)) {
      console.warn("salesGraph is not an array:", salesGraph);
      return;
    }

    const grouped = salesGraph.reduce((acc, sale) => {
      if (!sale.date) return acc;

      // Convert from dd/mm/yyyy to Date object
      const [day, month, year] = sale.date.split('/');
      const dateObj = new Date(`${year}-${month}-${day}`);
      if (isNaN(dateObj.getTime())) return acc;

      const dateStr = dateObj.toLocaleDateString('en-GB');
      acc[dateStr] = (acc[dateStr] || 0) + parseFloat(sale.amount || 0);
      return acc;
    }, {});

    const formatted = Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/');
        const [dayB, monthB, yearB] = b.date.split('/');
        return new Date(`${yearA}-${monthA}-${dayA}`).getTime() -
               new Date(`${yearB}-${monthB}-${dayB}`).getTime();
      });

    setData(formatted);
  }, [salesGraph]);

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
