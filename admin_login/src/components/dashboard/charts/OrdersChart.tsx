// File: src/components/dashboard/charts/OrdersChart.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface OrderData {
  date: string;
  total: number;
}

const OrdersChart = () => {
  const [data, setData] = useState<OrderData[]>([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const grouped = storedOrders.reduce((acc: Record<string, number>, order: any) => {
      const date = new Date(order.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const formatted = Object.entries(grouped).map(([date, total]) => ({ date, total }));
    setData(formatted);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e0e0e0" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
