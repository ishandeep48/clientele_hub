// src/components/dashboard/charts/LeadsVsCustomersChart.tsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0ea5e9', '#10b981'];

const LeadsVsCustomersChart = ({lvcGraph}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const chartData= lvcGraph;
    setData(chartData);
  }, [lvcGraph]);

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

export default LeadsVsCustomersChart;
