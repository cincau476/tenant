import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import MenuModal from '../components/MenuModal'; 
import { 
  getStands, 
  getMenus, 
  updateMenu, 
  deleteMenu, 
  createMenu 
} from '../api/apiService';

const MenuManagement = () => {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [error, setError] = useState(null);
  
  // STATE BARU: Untuk menangani penolakan ABAC Jam Operasional
  const [abacError, setAbacError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoadingStands(true);
        setAbacError(null);
        
        const response = await getStands();
        setStands(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedStand(response.data[0]);
        } else {
          setError("Anda tidak terhubung dengan stand manapun.");
        }
      } catch (err) {
        // TANGKAP ERROR ABAC
        if (err.isAbacError) {
          setAbacError(err.message);
        } else {
          setError('Gagal memuat data stand.');
        }
      } finally {
        setLoadingStands(false);
      }
    };
    fetchStands();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      if (!selectedStand) {
        setMenuItems([]); 
        return;
      }
      try {
        setLoadingMenus(true);
        setError(null); 
        setAbacError(null);
        
        const response = await getMenus(selectedStand.id);
        setMenuItems(response.data);
      } catch (err) {
        // TANGKAP ERROR ABAC
        if (err.isAbacError) {
          setAbacError(err.message);
        } else {
          setError(`Gagal memuat menu untuk ${selectedStand.name}.`);
        }
      } finally {
        setLoadingMenus(false);
      }
    };
    fetchMenus();
  }, [selectedStand]);

  const handleAvailabilityChange = async (item) => {
    const newAvailableState = !item.available;
    const standId = selectedStand.id;
    const menuId = item.id;

    setMenuItems(prevItems =>
      prevItems.map(i => i.id === menuId ? { ...i, available: newAvailableState } : i)
    );
    try {
      await updateMenu(standId, menuId, { available: newAvailableState });
    } catch (err) {
      if (err.isAbacError) {
         alert(`Akses ditolak: ${err.message}`);
      } else {
         setError(`Gagal update ${item.name}.`);
      }
      // Revert state jika gagal
      setMenuItems(prevItems =>
        prevItems.map(i => i.id === menuId ? { ...i, available: item.available } : i )
      );
    }
  };

  const handleDeleteMenu = async (item) => {
    const standId = selectedStand.id;
    const menuId = item.id;
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${item.name}?`)) return;
    
    const originalItems = [...menuItems];
    setMenuItems(prevItems => prevItems.filter(i => i.id !== menuId));
    try {
      await deleteMenu(standId, menuId);
    } catch (err) {
      if (err.isAbacError) {
         alert(`Akses ditolak: ${err.message}`);
      } else {
         setError(`Gagal menghapus ${item.name}.`);
      }
      // Revert state jika gagal
      setMenuItems(originalItems);
    }
  };
  
  const handleStandChange = (e) => {
    const standId = parseInt(e.target.value);
    const stand = stands.find(s => s.id === standId);
    setSelectedStand(stand);
  };

  const handleSaveMenu = async (formData) => {
    if (!selectedStand) throw new Error("Tidak ada stand yang dipilih.");
    
    try {
      if (editingItem) {
        // PROSES EDIT (PATCH)
        const response = await updateMenu(selectedStand.id, editingItem.id, formData);
        setMenuItems(prevItems => prevItems.map(item => item.id === editingItem.id ? response.data : item));
      } else {
        // PROSES TAMBAH (POST)
        const response = await createMenu(selectedStand.id, formData);
        setMenuItems(prevItems => [response.data, ...prevItems]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
       if (err.isAbacError) {
         alert(`Akses ditolak: ${err.message}`);
       } else {
         throw err; // Lempar ke komponen modal agar ditangani di sana
       }
    }
  };

  // UI GUARD: Tampilkan halaman error jika terkena ABAC (Di luar jam operasional)
  if (abacError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-red-900">
            Akses Ditolak
          </h2>
          <p className="text-sm font-medium text-red-800">
            {abacError}
          </p>
          <div className="mt-4 rounded-lg bg-red-100/50 p-3 text-xs text-red-700">
            Kantin sedang di luar jam operasional. Manajemen menu ditutup sementara.
          </div>
        </div>
      </div>
    );
  }

  if (loadingStands) return <div className="text-center p-4">Memuat stand...</div>;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Menu</h1>
          <p className="text-gray-500 mt-1">Kelola item menu Anda dengan mudah</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedStand} 
        >
          <Plus size={20} className="mr-2" />
          Tambah Menu Baru
        </button>
      </div>

      {stands.length > 1 && (
        <div className="mb-6">
          <label htmlFor="stand-select" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Stand untuk Dikelola:
          </label>
          <div className="relative w-full max-w-xs">
            <select id="stand-select" className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500" onChange={handleStandChange} value={selectedStand ? selectedStand.id : ''} disabled={stands.length === 0}>
              {stands.map(stand => (<option key={stand.id} value={stand.id}>{stand.name}</option>))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><ChevronDown size={20} /></div>
          </div>
        </div>
      )}
      
      {error && <div className="p-4 my-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">{error}</div>}

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
              onEdit={() => { setEditingItem(item); setIsModalOpen(true); }}
            />
          ))}
        </div>
      )}

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSubmit={handleSaveMenu}
        initialData={editingItem} 
        standId={selectedStand?.id}
      />
    </div>
  );
};

export default MenuManagement;
