// LeadsChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Lead {
  status: 'New' | 'Connected' | 'Qualified' | 'Lost';
}

interface LeadsChartProps {
  leads: Lead[];
}

const LeadsChart: React.FC<LeadsChartProps> = ({ leads }) => {
  const statusCounts = {
    New: 0,
    Connected: 0,
    Qualified: 0,
    Lost: 0,
  };

  leads.forEach((lead) => {
    statusCounts[lead.status]++;
  });

  const chartData = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status as keyof typeof statusCounts],
  }));

  return (
    <div style={{ width: '100%', height: 300, marginBottom: '2rem' }}>
      <h3 style={{ paddingLeft: '1rem' }}>Lead Status Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadsChart;
