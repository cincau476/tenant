// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import MfaSetupModal from '../components/MfaSetupModal.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // Mengambil data user
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
  
  // State untuk mengontrol Modal Setup MFA
  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const { user } = useAuth(); // Ambil data user dari context

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
      <div className="flex h-[60vh] items-center justify-center">
        <FiLoader className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Selamat Datang!</h2>
          <p className="text-gray-500 text-sm">Pantau performa kantin Anda hari ini.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Tombol Setup MFA Dinamis */}
          {user && (
            <button
              onClick={() => setIsMfaOpen(true)}
              className={`flex items-center gap-2 font-semibold text-sm px-4 py-2 rounded-xl transition-all shadow-sm border ${
                user.is_mfa_enabled
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              {user.is_mfa_enabled ? '✅ MFA Aktif (Reset)' : '⚠️ Aktifkan MFA'}
            </button>
          )}

          <div className="text-xs bg-orange-100 px-3 py-2.5 rounded-full text-orange-600 border border-orange-200 font-medium">
            Live Update
          </div>
        </div>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pendapatan" 
          value={`Rp ${stats?.main_stats?.total_revenue?.toLocaleString() || '0'}`} 
          icon={FiDollarSign} 
          color="text-emerald-600"
        />
        <StatCard 
          title="Total Pesanan" 
          value={stats?.stats_today?.total || '0'} 
          icon={FiShoppingBag} 
          color="text-blue-600"
        />
        <StatCard 
          title="Pelanggan" 
          value={stats?.main_stats?.active_customers || '0'} 
          icon={FiUsers} 
          color="text-purple-600"
        />
        <StatCard 
          title="Selesai" 
          value={stats?.stats_today?.completed || '0'} 
          icon={FiCheckCircle} 
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Grafik Penjualan</h3>
          <div className="min-w-[300px]">
            <SalesChart data={stats?.sales_by_hour} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">5 Menu Terlaris</h3>
          <TopProducts productsData={stats?.top_selling_products} />
        </div>
      </div>

      {/* Modal MFA Setup dengan fitur Auto-Reload saat sukses */}
      <MfaSetupModal 
        isOpen={isMfaOpen} 
        onClose={() => setIsMfaOpen(false)} 
        onSuccess={() => {
          // Melakukan refresh halaman setelah OTP sukses diverifikasi
          // agar AuthContext kembali mengambil data terbaru dari backend Django
          window.location.reload(); 
        }}
      />
    </div>
  );
}
