import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-blue-600">{`penjualan : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Terima 'salesData' sebagai props
const SalesChart = ({ salesData }) => {
    const [activeIndex, setActiveIndex] = React.useState(-1);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Penjualan per Jam</h3>
            <p className="text-sm text-gray-500">Grafik penjualan Anda hari ini</p>
            
            {/* PERBAIKAN: Div ini sekarang memiliki tinggi eksplisit 288px 
              (setara dengan 'h-72' Tailwind) untuk memperbaiki error rendering 'recharts'.
            */}
            <div className="mt-6" style={{ height: '288px' }}> 
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={salesData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        onMouseMove={(state) => {
                            if (state.isTooltipActive) {
                                setActiveIndex(state.activeTooltipIndex);
                            } else {
                                setActiveIndex(-1);
                            }
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.6)' }} />
                        <Bar dataKey="penjualan" radius={[8, 8, 0, 0]}>
                            {salesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === activeIndex ? '#2563EB' : '#93C5FD'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;