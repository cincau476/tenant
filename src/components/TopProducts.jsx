// src/components/StatCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

// StatCard menerima Icon sebagai referensi komponen (misal: FiDollarSign)
const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, color }) => {
  const changeColor = {
    increase: 'text-green-500 bg-green-100',
    decrease: 'text-red-500 bg-red-100',
    neutral: 'text-gray-500 bg-gray-100',
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {/* Render Icon sebagai komponen */}
        <div className={`bg-gray-700 p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <div className={`text-xs mt-1 flex items-center`}>
            <span className={`flex items-center px-2 py-0.5 rounded-full font-semibold ${changeColor[changeType]}`}>
               {changeType !== 'neutral' && <ChangeIcon size={12} className="mr-1" />}
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
