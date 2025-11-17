import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Sparkles,
  Settings,
  LogOut, // <-- (Opsional) Impor ikon logout
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import MenuManagement from "./pages/MenuManagement";
import VariantManagement from "./pages/VariantManagement";
import StandSettings from "./pages/StandSettings";
import LoginPage from "./pages/LoginPage"; // <-- Impor Halaman Login
import { checkAuth, logout } from "./api/apiService";


const App = () => {
  const [expanded, setExpanded] = useState(true);
  const [activePage, setActivePage] = useState("Overview");

  // --- TAMBAHKAN LOGIKA AUTENTIKASI ---
  // 1. State untuk melacak status login
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  // 2. Cek localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Coba panggil endpoint /auth/user/
        // Jika sukses (cookie valid), backend akan kirim data user
        await checkAuth();
        setIsAuthenticated(true);
      } catch (err) {
        // Jika error (401), berarti cookie tidak valid/tidak ada
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // 3. Fungsi yang dipanggil oleh LoginPage saat login sukses
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // 4. Fungsi untuk Logout
  const handleLogout = async () => {
    try {
      await logout(); // Panggil API logout
    } catch (err) {
      console.error("Gagal logout:", err);
    } finally {
      // HAPUS: localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setActivePage('Overview');
    }
  };

  // --- KONTEN DINAMIS ---
  const renderContent = () => {
    // ... (switch case Anda tidak berubah)
    switch (activePage) {
      case "Overview":
        return <Dashboard />;
      case "Daftar Pesanan":
        return <OrderManagement />;
      case "Manajemen Menu":
        return <MenuManagement />;
      case "Manajemen Varian":
        return <VariantManagement />;
      case "Pengaturan Stand":
        return <StandSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Memverifikasi sesi...
      </div>
    );
  }
  
  // --- PENJAGA HALAMAN (RENDER UTAMA) ---

  // 5. Jika belum terautentikasi, tampilkan halaman Login
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 6. Jika sudah terautentikasi, tampilkan Dashboard
  return (
    <div className="overflow-x-hidden">
      <div className="flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Overview"
            active={activePage === "Overview"}
            onClick={() => setActivePage("Overview")}
          />
          <SidebarItem
            icon={<ClipboardList size={20} />}
            text="Daftar Pesanan"
            active={activePage === "Daftar Pesanan"}
            onClick={() => setActivePage("Daftar Pesanan")}
            alert
          />
          <SidebarItem
            icon={<Package size={20} />}
            text="Manajemen Menu"
            active={activePage === "Manajemen Menu"}
            onClick={() => setActivePage("Manajemen Menu")}
          />
          <SidebarItem
            icon={<Sparkles size={20} />}
            text="Manajemen Varian"
            active={activePage === "Manajemen Varian"}
            onClick={() => setActivePage("Manajemen Varian")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Pengaturan Stand"
            active={activePage === "Pengaturan Stand"}
            onClick={() => setActivePage("Pengaturan Stand")}
          />
          
          {/* (Opsional) Tambahkan item logout di sidebar */}
          <hr className="my-3" />
          <SidebarItem
            icon={<LogOut size={20} />}
            text="Logout"
            onClick={handleLogout} // Panggil fungsi logout
          />

        </Sidebar>
        <main
          className={`flex-1 p-6 transition-all ${
            expanded ? "ml-72" : "ml-20"
          }`}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;