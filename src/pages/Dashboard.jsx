import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import TopProducts from '../components/TopProducts'; // <-- Ganti dari RecentOrders
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { getReportSummary } from '../api/apiService'; // <-- Impor API

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getReportSummary();
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data dashboard. Pastikan Anda sudah login.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Tampilkan status Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Memuat data dashboard...</p>
      </div>
    );
  }

  // Tampilkan status Error
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Tampilkan jika data tidak ada (seharusnya tidak terjadi jika API sukses)
  if (!data) {
    return <div>Data tidak ditemukan.</div>;
  }

  // --- Format Data dari API ---
  // API mengembalikan: 
  // data.stats_today, data.stand_performance, 
  // data.top_selling_products, data.sales_by_hour

  // 1. Format untuk StatCard
  // Asumsi dashboard ini untuk 1 tenant, kita ambil data performa stand pertama
  const standPerformance = data.stand_performance[0] || { revenue: 0, orders: 0 };
  
  const statsData = [
    {
      title: 'Total Pendapatan Hari Ini',
      value: `Rp ${Number(standPerformance.revenue).toLocaleString('id-ID')}`,
      change: `${standPerformance.orders} pesanan`,
      changeType: 'neutral',
      icon: DollarSign,
    },
    {
      title: 'Total Pesanan Hari Ini',
      value: data.stats_today.total,
      change: `${data.stats_today.preparing} sedang diproses`,
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      title: 'Menu Terlaris',
      value: data.top_selling_products[0]?.menu_item__name || 'N/A',
      change: `${data.top_selling_products[0]?.total_sold || 0} porsi terjual`,
      changeType: 'neutral',
      icon: TrendingUp,
    },
  ];

  // 2. Format untuk SalesChart
  // API beri: {hour: "08", orders: 5}
  // Komponen mau: {hour: "08:00", penjualan: 5}
  const formattedSalesData = data.sales_by_hour.map(item => ({
    hour: `${item.hour}:00`,
    penjualan: item.orders,
  }));

  return (
    <div>
      <header>
        {/* Anda bisa ganti nama "Warung Bu Siti" dengan data dari user/tenant */}
        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang!</h1>
        <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas stand Anda hari ini</p>
      </header>

      {/* 1. Render StatCard dengan data API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8">
        {/* 2. Render SalesChart dengan data API */}
        <SalesChart salesData={formattedSalesData} />
        
        {/* 3. Render TopProducts dengan data API */}
        <TopProducts productsData={data.top_selling_products} />
      </div>
    </div>
  );
};

export default Dashboard;