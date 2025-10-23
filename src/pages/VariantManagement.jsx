import React, { useState, useEffect } from 'react';
import VariantGroupList from '../components/VariantGroupList';
import VariantOptionList from '../components/VariantOptionList';
import VariantGroupModal from '../components/VariantGroupModal'; // <-- Impor
import VariantOptionModal from '../components/VariantOptionModal'; // <-- Impor
import { ChevronDown } from 'lucide-react';
import {
  getStands,
  getVariantGroups,
  createVariantGroup,
  deleteVariantGroup,
  createVariantOption,
  deleteVariantOption,
} from '../api/apiService'; // <-- Impor semua API

// Hapus 'initialVariantData'

const VariantManagement = () => {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [variantGroups, setVariantGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState(null);
  
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isOptionModalOpen, setOptionModalOpen] = useState(false);

  // 1. Ambil daftar stand
  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoadingStands(true);
        const response = await getStands();
        setStands(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedStand(response.data[0]);
        } else {
          setError("Anda tidak terhubung dengan stand manapun.");
        }
      } catch (err) {
        setError('Gagal memuat data stand.');
      } finally {
        setLoadingStands(false);
      }
    };
    fetchStands();
  }, []);

  // 2. Ambil grup varian setiap kali stand berubah
  useEffect(() => {
    if (!selectedStand) return;
    
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        setError(null);
        const response = await getVariantGroups(selectedStand.id);
        setVariantGroups(response.data);
        
        // Pilih grup pertama secara otomatis jika ada
        if (response.data && response.data.length > 0) {
          if (!selectedGroupId || !response.data.find(g => g.id === selectedGroupId)) {
             setSelectedGroupId(response.data[0].id);
          }
        } else {
          setSelectedGroupId(null); // Kosongkan jika tidak ada grup
        }
      } catch (err) {
        setError('Gagal memuat grup varian.');
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [selectedStand]); // <-- Re-fetch saat stand berubah

  // Fungsi untuk me-refresh data grup (setelah create/delete)
  const refreshGroups = async () => {
    if (!selectedStand) return;
    try {
      const response = await getVariantGroups(selectedStand.id);
      setVariantGroups(response.data);
      if (!selectedGroupId && response.data.length > 0) {
        setSelectedGroupId(response.data[0].id);
      }
    } catch (err) {
      console.error("Gagal refresh grup:", err);
    }
  };

  // --- Handlers ---
  const handleStandChange = (e) => {
    const stand = stands.find(s => s.id === parseInt(e.target.value));
    setSelectedStand(stand);
    setSelectedGroupId(null); // Reset pilihan grup
  };
  
  const handleCreateGroup = async (name) => {
    await createVariantGroup(selectedStand.id, name);
    await refreshGroups(); // Ambil data baru
  };

  const handleDeleteGroup = async (groupId) => {
    await deleteVariantGroup(selectedStand.id, groupId);
    if (selectedGroupId === groupId) {
      setSelectedGroupId(null); // Reset pilihan jika yg dihapus sedang dipilih
    }
    await refreshGroups(); // Ambil data baru
  };
  
  const handleCreateOption = async (data) => {
    await createVariantOption(selectedStand.id, selectedGroupId, data);
    await refreshGroups(); // Ambil data baru
  };
  
  const handleDeleteOption = async (optionId) => {
    await deleteVariantOption(selectedStand.id, selectedGroupId, optionId);
    await refreshGroups(); // Ambil data baru
  };

  const selectedGroup = variantGroups.find(group => group.id === selectedGroupId);

  if (loadingStands) {
    return <div className="p-4 text-center">Memuat data stand...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Varian</h1>
        <p className="text-gray-500 mt-1">Kelola grup varian dan opsi untuk menu Anda</p>
      </div>
      
      {/* Selector Stand (Sama seperti MenuManagement) */}
      {stands.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Stand:</label>
          <div className="relative w-full max-w-xs">
            <select
              onChange={handleStandChange}
              value={selectedStand ? selectedStand.id : ''}
              className="w-full appearance-none bg-white border border-gray-300 py-2 px-4 pr-8 rounded-lg"
            >
              {stands.map(stand => (
                <option key={stand.id} value={stand.id}>{stand.name}</option>
              ))}
            </select>
            <ChevronDown size={20} className="pointer-events-none absolute inset-y-0 right-3 top-2.5 text-gray-700" />
          </div>
        </div>
      )}
      
      {error && <div className="p-4 my-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            {loadingGroups ? <p>Memuat grup...</p> : (
              <VariantGroupList 
                  groups={variantGroups}
                  selectedGroupId={selectedGroupId}
                  onSelectGroup={setSelectedGroupId}
                  onAddGroup={() => setGroupModalOpen(true)}
                  onDeleteGroup={handleDeleteGroup}
              />
            )}
        </div>
        <div className="lg:col-span-2">
            {selectedGroup ? (
                <VariantOptionList 
                    key={selectedGroup.id}
                    group={selectedGroup}
                    onAddOption={() => setOptionModalOpen(true)}
                    onDeleteOption={handleDeleteOption}
                />
            ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">
                      {loadingGroups ? 'Memuat...' : 'Pilih grup untuk melihat opsinya.'}
                    </p>
                </div>
            )}
        </div>
      </div>
      
      {/* Render Modals */}
      <VariantGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
      <VariantOptionModal
        isOpen={isOptionModalOpen}
        onClose={() => setOptionModalOpen(false)}
        onSubmit={handleCreateOption}
      />
    </div>
  );
};

export default VariantManagement;