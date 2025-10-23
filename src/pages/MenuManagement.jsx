import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import MenuModal from '../components/MenuModal'; // Pastikan file ini ada
import { 
  getStands, 
  getMenus, 
  updateMenu, 
  deleteMenu, 
  createMenu // Impor ini sekarang akan berhasil
} from '../api/apiService';

const MenuManagement = () => {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  // --- 1. Ambil daftar stand saat komponen dimuat ---
  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoadingStands(true);
        const response = await getStands();
        setStands(response.data);
        
        // Otomatis pilih stand pertama jika ada
        if (response.data && response.data.length > 0) {
          setSelectedStand(response.data[0]);
        } else {
          setError("Anda tidak terhubung dengan stand manapun.");
        }
      } catch (err) {
        setError('Gagal memuat data stand.');
        console.error(err);
      } finally {
        setLoadingStands(false);
      }
    };

    fetchStands();
  }, []); // <-- [] berarti hanya jalan sekali

  // --- 2. Ambil menu setiap kali 'selectedStand' berubah ---
  useEffect(() => {
    const fetchMenus = async () => {
      if (!selectedStand) {
        setMenuItems([]); // Kosongkan menu jika tidak ada stand
        return;
      }
      
      try {
        setLoadingMenus(true);
        setError(null); // Hapus error lama
        const response = await getMenus(selectedStand.id);
        setMenuItems(response.data);
      } catch (err) {
        setError(`Gagal memuat menu untuk ${selectedStand.name}.`);
        console.error(err);
      } finally {
        setLoadingMenus(false);
      }
    };

    fetchMenus();
  }, [selectedStand]); // <-- Jalankan ulang saat selectedStand berubah

  // --- Handler untuk mengubah status 'available' ---
  const handleAvailabilityChange = async (item) => {
    const newAvailableState = !item.available;
    const standId = selectedStand.id;
    const menuId = item.id;

    // Optimistic Update
    setMenuItems(prevItems =>
      prevItems.map(i =>
        i.id === menuId ? { ...i, available: newAvailableState } : i
      )
    );
    try {
      await updateMenu(standId, menuId, { available: newAvailableState });
    } catch (err) {
      setError(`Gagal update ${item.name}.`);
      setMenuItems(prevItems =>
        prevItems.map(i =>
          i.id === menuId ? { ...i, available: item.available } : i // Kembalikan
        )
      );
    }
  };

  // --- Handler untuk menghapus menu ---
  const handleDeleteMenu = async (item) => {
    const standId = selectedStand.id;
    const menuId = item.id;
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${item.name}?`)) {
      return;
    }
    const originalItems = [...menuItems];
    setMenuItems(prevItems => prevItems.filter(i => i.id !== menuId));
    try {
      await deleteMenu(standId, menuId);
    } catch (err) {
      setError(`Gagal menghapus ${item.name}.`);
      setMenuItems(originalItems);
    }
  };
  
  // --- Handler untuk ganti stand di dropdown ---
  const handleStandChange = (e) => {
    const standId = parseInt(e.target.value);
    const stand = stands.find(s => s.id === standId);
    setSelectedStand(stand);
  };

  // --- Handler untuk 'onSubmit' modal ---
  const handleCreateMenu = async (formData) => {
    if (!selectedStand) {
      throw new Error("Tidak ada stand yang dipilih.");
    }
    
    // Kirim data (lempar error jika gagal agar modal bisa menangani)
    const response = await createMenu(selectedStand.id, formData);
    
    // Jika sukses:
    // 1. Tambahkan menu baru ke state
    setMenuItems(prevItems => [response.data, ...prevItems]);
    // 2. Tutup modal
    setIsModalOpen(false);
  };

  // Tampilkan status Loading utama
  if (loadingStands) {
    return <div className="text-center p-4">Memuat stand...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Menu</h1>
          <p className="text-gray-500 mt-1">Kelola item menu Anda dengan mudah</p>
        </div>
        {/* Sambungkan tombol 'onClick' */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          disabled={!selectedStand} // Disable tombol jika tidak ada stand
        >
          <Plus size={20} className="mr-2" />
          Tambah Menu Baru
        </button>
      </div>

      {/* Tampilkan dropdown HANYA JIKA user punya LEBIH DARI 1 stand (Admin) */}
      {stands.length > 1 && (
        <div className="mb-6">
          <label htmlFor="stand-select" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Stand untuk Dikelola:
          </label>
          <div className="relative w-full max-w-xs">
            <select
              id="stand-select"
              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              onChange={handleStandChange}
              value={selectedStand ? selectedStand.id : ''}
              disabled={stands.length === 0}
            >
              {stands.map(stand => (
                <option key={stand.id} value={stand.id}>
                  {stand.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
      )}
      
      {/* Tampilkan error di bawah selector */}
      {error && <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>}

      {/* Tampilkan Menu Grid */}
      {loadingMenus ? (
        <div className="text-center p-4">Memuat menu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map(item => (
            <MenuCard
              key={item.id}
              item={item} 
              onAvailabilityChange={() => handleAvailabilityChange(item)}
              onDelete={() => handleDeleteMenu(item)}
            />
          ))}
        </div>
      )}

      {/* Render Modal di akhir */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateMenu}
        standId={selectedStand?.id}
      />
    </div>
  );
};

export default MenuManagement;