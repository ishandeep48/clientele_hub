// src/components/dashboard/charts/FeedbackSentimentChart.tsx
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#16a34a', '#facc15', '#ef4444'];

const FeedbackSentimentChart = ({feedbackGraph}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const feedback =feedbackGraph;
    console.log(feedback)
    let good = 0, neutral = 0, bad = 0; // chneged this shi

    feedback.forEach((rating: any) => {
      if (rating >= 4) good++;
      else if (rating === 3) neutral++;
      else bad++;
    });

    setData([
      { name: 'Positive', value: good },
      { name: 'Neutral', value: neutral },
      { name: 'Negative', value: bad },
    ]);
  }, [feedbackGraph]);

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

export default FeedbackSentimentChart;
