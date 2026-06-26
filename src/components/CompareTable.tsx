import React from 'react';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';

export interface ComparisonItem {
  id: string;
  city: string;
  propertyType: string;
  bedrooms: number;
  area: number;
  prediction: number;
}

interface Props {
  items: ComparisonItem[];
  onRemove: (id: string) => void;
}

export function CompareTable({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
        <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">Property Comparison</h3>
        <p className="text-sm text-neutral-500">Compare multiple valuation scenarios side-by-side.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500 uppercase font-mono tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Config</th>
              <th className="px-6 py-4 font-semibold">Area</th>
              <th className="px-6 py-4 font-semibold text-brand-600">Valuation</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-900">{item.city}</td>
                <td className="px-6 py-4 text-neutral-600">{item.propertyType}</td>
                <td className="px-6 py-4 text-neutral-600">{item.bedrooms} BHK</td>
                <td className="px-6 py-4 text-neutral-600">{item.area} sq.ft</td>
                <td className="px-6 py-4 font-semibold text-neutral-900">₹{item.prediction.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
