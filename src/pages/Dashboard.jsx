import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import TopProducts from '../components/TopProducts';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { getReportSummary } from '../api/apiService';

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
        setError('Gagal memuat data dashboard. Pastikan server aktif dan Anda sudah login.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      <p className="ml-3 text-gray-500">Memuat data...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
      <p className="text-red-700">{error}</p>
    </div>
  );

  // --- LOGIKA AMAN (Safe Access) ---
  // Pastikan data memiliki properti yang dibutuhkan, jika tidak gunakan default
  const statsToday = data?.stats_today || { total: 0, preparing: 0 };
  const standPerf = data?.stand_performance?.[0] || { revenue: 0, orders: 0 };
  const topProduct = data?.top_selling_products?.[0] || { menu_item__name: 'Belum ada data', total_sold: 0 };
  const salesByHour = data?.sales_by_hour || [];

  const statsCards = [
    {
      title: 'Pendapatan Hari Ini',
      value: `Rp ${Number(standPerf.revenue).toLocaleString('id-ID')}`,
      change: `${standPerf.orders} pesanan`,
      changeType: 'neutral',
      icon: DollarSign,
    },
    {
      title: 'Total Pesanan',
      value: statsToday.total,
      change: `${statsToday.preparing} sedang diproses`,
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      title: 'Produk Terlaris',
      value: topProduct.menu_item__name,
      change: `${topProduct.total_sold} porsi terjual`,
      changeType: 'neutral',
      icon: TrendingUp,
    },
  ];

  const formattedChartData = salesByHour.map(item => ({
    name: `${item.hour}:00`,
    sales: item.orders,
  }));

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ringkasan Stand</h1>
        <p className="text-gray-500">Pantau performa penjualan Anda secara real-time</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {/* Pastikan SalesChart menerima data yang benar */}
        <SalesChart data={formattedChartData} />
        <TopProducts productsData={data?.top_selling_products || []} />
      </div>
    </div>
  );
};

export default Dashboard;