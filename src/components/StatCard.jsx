import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon }) => {
  const changeColor = {
    increase: 'text-green-500 bg-green-100',
    decrease: 'text-red-500 bg-red-100',
    neutral: 'text-gray-500 bg-gray-100',
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className={`text-xs mt-1 flex items-center`}>
          <span className={`flex items-center px-2 py-0.5 rounded-full font-semibold ${changeColor[changeType]}`}>
             {changeType !== 'neutral' && <ChangeIcon size={12} className="mr-1" />}
            {change}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
