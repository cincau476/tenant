import React from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import RecentOrders from '../components/RecentOrders';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

// Data dummy/mock, nantinya ini akan diambil dari API /reports/summary/
const statsData = [
  {
    title: 'Total Pendapatan Hari Ini',
    value: 'Rp 1.245.000',
    change: '+12.5% dari kemarin',
    changeType: 'increase',
    icon: DollarSign,
  },
  {
    title: 'Total Pesanan Hari Ini',
    value: '87',
    change: '+8 dari kemarin',
    changeType: 'increase',
    icon: ShoppingCart,
  },
  {
    title: 'Menu Terlaris',
    value: 'Nasi Goreng',
    change: '32 porsi terjual',
    changeType: 'neutral',
    icon: TrendingUp,
  },
];

const Dashboard = () => {
  return (
    <div>
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang, Warung Bu Siti</h1>
        <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas stand Anda hari ini</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;
