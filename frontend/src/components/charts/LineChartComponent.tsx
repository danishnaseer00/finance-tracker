import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  income: number;
  expenses: number;
  balance: number;
}

interface LineChartComponentProps {
  data: ChartData[];
  title: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, title }) => {
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
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="name" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip 
            wrapperStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }} 
            labelStyle={{ color: 'var(--text-primary)' }}
            contentStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            name="Income" 
            stroke="#10b981" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            name="Expenses" 
            stroke="#ef4444" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            name="Balance" 
            stroke="#3b82f6" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;