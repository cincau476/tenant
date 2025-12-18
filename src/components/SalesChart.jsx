// src/components/SalesChart.jsx
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function SalesChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
      {/* PENTING: Gunakan h-[300px] (tinggi tetap) bukannya h-full 
          agar ResponsiveContainer tidak membaca nilai -1 
      */}
      <div className="w-full h-[300px] min-h-[300px]"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#f97316" 
              fill="#ffedd5" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}