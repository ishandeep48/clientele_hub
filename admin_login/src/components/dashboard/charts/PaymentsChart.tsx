// src/components/dashboard/charts/PaymentsChart.tsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#f97316', '#3b82f6', '#ef4444'];

const PaymentsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const methodCount = payments.reduce((acc: any, curr: any) => {
      acc[curr.method] = (acc[curr.method] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.keys(methodCount).map((key) => ({ name: key, value: methodCount[key] }));
    setData(chartData);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentsChart;
