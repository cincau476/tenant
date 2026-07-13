import React, { useState, useEffect } from 'react';
import VariantGroupList from '../components/VariantGroupList';
import VariantOptionList from '../components/VariantOptionList';
import VariantGroupModal from '../components/VariantGroupModal';
import VariantOptionModal from '../components/VariantOptionModal';
import { ChevronDown } from 'lucide-react';
import {
  getStands,
  getVariantGroups,
  createVariantGroup,
  deleteVariantGroup,
  createVariantOption,
  deleteVariantOption,
} from '../api/apiService';

const VariantManagement = () => {
  const [stands, setStands] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [variantGroups, setVariantGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState(null);
  
  // STATE BARU: Untuk menangani penolakan ABAC Jam Operasional
  const [abacError, setAbacError] = useState(null);
  
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [isOptionModalOpen, setOptionModalOpen] = useState(false);

  // 1. Ambil daftar stand
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

  // 2. Ambil grup varian setiap kali stand berubah
  useEffect(() => {
    if (!selectedStand) return;
    
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        setError(null);
        setAbacError(null);
        
        const response = await getVariantGroups(selectedStand.id);
        setVariantGroups(response.data);
        
        // Pilih grup pertama secara otomatis jika ada
        if (response.data && response.data.length > 0) {
          if (!selectedGroupId || !response.data.find(g => g.id === selectedGroupId)) {
             setSelectedGroupId(response.data[0].id);
          }
        } else {
          setSelectedGroupId(null);
        }
      } catch (err) {
        if (err.isAbacError) {
          setAbacError(err.message);
        } else {
          setError('Gagal memuat grup varian.');
        }
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [selectedStand]); 

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
      if (err.isAbacError) {
        setAbacError(err.message);
      }
      console.error("Gagal refresh grup:", err);
    }
  };

  // --- Handlers ---
  const handleStandChange = (e) => {
    const stand = stands.find(s => s.id === parseInt(e.target.value));
    setSelectedStand(stand);
    setSelectedGroupId(null);
  };
  
  const handleCreateGroup = async (name) => {
    try {
      await createVariantGroup(selectedStand.id, { name: name });
      await refreshGroups();
    } catch (err) {
      if (err.isAbacError) alert(`Akses ditolak: ${err.message}`);
      else setError('Gagal membuat grup varian.');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteVariantGroup(selectedStand.id, groupId);
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null);
      }
      await refreshGroups();
    } catch (err) {
      if (err.isAbacError) alert(`Akses ditolak: ${err.message}`);
      else setError('Gagal menghapus grup varian.');
    }
  };
  
  const handleCreateOption = async (data) => {
    try {
      await createVariantOption(selectedStand.id, selectedGroupId, data);
      await refreshGroups();
    } catch (err) {
      if (err.isAbacError) alert(`Akses ditolak: ${err.message}`);
      else setError('Gagal membuat opsi varian.');
    }
  };
  
  const handleDeleteOption = async (optionId) => {
    try {
      await deleteVariantOption(selectedStand.id, selectedGroupId, optionId);
      await refreshGroups();
    } catch (err) {
      if (err.isAbacError) alert(`Akses ditolak: ${err.message}`);
      else setError('Gagal menghapus opsi varian.');
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
            Kantin sedang di luar jam operasional. Manajemen varian ditutup sementara.
          </div>
        </div>
      </div>
    );
  }

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
