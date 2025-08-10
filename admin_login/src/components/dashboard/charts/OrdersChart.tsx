// File: src/components/dashboard/charts/OrdersChart.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface OrderData {
  date: string;
  total: number;
}

const OrdersChart = ({ chartData }) => {
  const [data, setData] = useState<OrderData[]>([]);

  useEffect(() => {
    // const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const storedOrders = chartData;
    console.log(storedOrders);
    const grouped = storedOrders.reduce(
      (acc: Record<string, number>, order: any) => {
        if (!order.date) {
          console.log(`no date for order ${acc}`);
          return acc;
        }
        const [day, month, year] = order.date.split('/');
        const dateObj = new Date(`${year}-${month}-${day}`);
        if (isNaN(dateObj.getTime())) {
          console.log('Invalid date:', order.date);
          return acc;
        }
        const dateStr = dateObj.toLocaleDateString('en-GB');
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        
        return acc;
      },
      {}
    );

    
    const formatted = Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    })).sort((a, b) => {
      // Convert back to Date for proper sorting
      const [dayA, monthA, yearA] = a.date.split('/');
      const [dayB, monthB, yearB] = b.date.split('/');
      return new Date(`${yearA}-${monthA}-${dayA}`).getTime() - 
             new Date(`${yearB}-${monthB}-${dayB}`).getTime();
    });
    setData(formatted);
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e0e0e0" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OrdersChart;
