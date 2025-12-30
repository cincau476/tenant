// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import TopProducts from '../components/TopProducts';
import { getDashboardStats } from '../api/apiService';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiCheckCircle, 
  FiLoader 
} from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 lg:ml-64 w-full transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Tenant</h1>
              <p className="text-gray-400 text-sm">Pantau performa kantin Anda hari ini.</p>
            </div>
            <div className="text-xs bg-gray-800 px-3 py-1 rounded-full text-orange-400 border border-orange-500/20">
              Live Update
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PERBAIKAN: Kirim referensi komponen, bukan elemen JSX */}
            <StatCard 
              title="Pendapatan" 
              value={`Rp ${stats?.main_stats?.total_revenue?.toLocaleString() || '0'}`} 
              icon={FiDollarSign} 
              color="text-green-500"
            />
            <StatCard 
              title="Total Pesanan" 
              value={stats?.stats_today?.total || '0'} 
              icon={FiShoppingBag} 
              color="text-blue-500"
            />
            <StatCard 
              title="Pelanggan Aktif" 
              value={stats?.main_stats?.active_customers || '0'} 
              icon={FiUsers} 
              color="text-purple-500"
            />
            <StatCard 
              title="Selesai" 
              value={stats?.stats_today?.completed || '0'} 
              icon={FiCheckCircle} 
              color="text-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Grafik Penjualan Per Jam</h3>
              <div className="min-w-[300px]">
                <SalesChart data={stats?.sales_by_hour} />
              </div>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700">
              {/* PERBAIKAN: Gunakan prop productsData agar sesuai dengan komponen TopProducts.jsx */}
              <h3 className="text-lg font-semibold mb-4">5 Menu Terlaris</h3>
              <TopProducts productsData={stats?.top
