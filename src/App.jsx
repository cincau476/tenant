import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Sparkles,
  Settings,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import MenuManagement from "./pages/MenuManagement";
import VariantManagement from "./pages/VariantManagement";
import StandSettings from "./pages/StandSettings"; // <-- Impor halaman baru

const App = () => {
  const [expanded, setExpanded] = useState(true);
  const [activePage, setActivePage] = useState("Overview");

  const renderContent = () => {
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
        return <StandSettings />; // <-- Tambahkan case untuk halaman baru
      default:
        return <Dashboard />;
    }
  };

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

