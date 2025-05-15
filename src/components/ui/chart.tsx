
import React from 'react';
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, PieChart as RechartsPieChart, 
         Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

type ChartProps = {
  data: any[];
  categories?: string[];
  index?: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  startAxisFromZero?: boolean;
  className?: string;
};

export const BarChart = ({ 
  data, 
  categories = [], 
  index = 'name', 
  colors = ['#4FD1C5'], 
  valueFormatter = (value) => `${value}`,
  startAxisFromZero = false,
  className = 'h-80',
}: ChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis domain={startAxisFromZero ? [0, 'auto'] : undefined} />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          {categories.map((category, index) => (
            <Bar key={category} dataKey={category} fill={colors[index % colors.length]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChart = ({ 
  data, 
  categories = [], 
  index = 'name', 
  colors = ['#4FD1C5'], 
  valueFormatter = (value) => `${value}`,
  className = 'h-80',
}: ChartProps) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip formatter={(value) => valueFormatter(Number(value))} />
          <Legend />
          {categories.map((category, index) => (
            <Line key={category} type="monotone" dataKey={category} stroke={colors[index % colors.length]} />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart = ({ 
  data, 
  category = 'value', 
  index = 'name', 
  colors = ['#4FD1C5', '#38B2AC', '#81E6D9', '#E6FFFA', '#285E61'], 
  className = 'h-80',
}: ChartProps & { category?: string }) => {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={data}
            dataKey={category}
            nameKey={index}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => entry[index]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
