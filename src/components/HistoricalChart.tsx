import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cityMultipliers } from '../data';
import { motion } from 'motion/react';

interface Props {
  city: string;
}

export function HistoricalChart({ city }: Props) {
  const data = useMemo(() => {
    const baseRate = cityMultipliers[city] || 5000;
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }).map((_, i) => {
      const year = currentYear - 5 + i;
      // Mock growth trajectory (general upward trend with slight variation)
      const volatility = 1 + (Math.random() * 0.04 - 0.02);
      const pastRate = baseRate * Math.pow(0.92, 5 - i) * volatility; 
      return {
        year: year.toString(),
        price: Math.round(pastRate)
      };
    });
  }, [city]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mt-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">5-Year Price Trend</h3>
        <p className="text-sm text-neutral-500">Historical average base rate (₹/sq.ft) for {city}</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `₹${val}`} dx={-10} width={80} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value: number) => [`₹${value}`, 'Avg Rate']}
            />
            <Line type="monotone" dataKey="price" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
