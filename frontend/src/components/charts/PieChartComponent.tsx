import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: ChartData[];
  title: string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title }) => {
  // Define colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  return (
    <div style={{ width: '100%', height: '300px', padding: '1rem' }}>
      <h3 style={{ 
        color: 'var(--text-primary)', 
        marginBottom: '1rem', 
        fontSize: 'var(--font-size-md)',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            wrapperStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }} 
            contentStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;