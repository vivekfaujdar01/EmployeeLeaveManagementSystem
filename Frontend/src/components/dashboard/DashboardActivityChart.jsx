import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardActivityChart = ({ title, data, barColor = '#3B82F6' }) => {
  return (
    <div className="lg:col-span-2 bg-card-bg rounded-2xl shadow-sm border border-border-color p-6 flex flex-col transition-colors duration-300">
      <h2 className="text-lg font-bold text-text-main mb-6">{title}</h2>
      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 14 }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
