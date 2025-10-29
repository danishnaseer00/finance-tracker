import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: ChartData[];
  title: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, title }) => {
  // Define colors for the bars
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#FF6B6B', '#4ECDC4'];

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
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip 
            wrapperStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }} 
            labelStyle={{ color: 'var(--text-primary)' }}
            contentStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend />
          <Bar dataKey="value" name="Amount">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;