import React, { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import { getStands, updateStand } from '../api/apiService';

const StandSettings = () => {
  const [standData, setStandData] = useState(null);
  const [standId, setStandId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // STATE BARU: Untuk menangani penolakan ABAC Jam Operasional
  const [abacError, setAbacError] = useState(null);

  // --- 1. Ambil data stand saat komponen dimuat ---
  useEffect(() => {
    const fetchStandData = async () => {
      try {
        setLoading(true);
        setAbacError(null);
        
        const response = await getStands();
        
        if (response.data && response.data.length > 0) {
          const currentStand = response.data[0];
          setStandData({
            name: currentStand.name,
            description: currentStand.description || '',
            imageUrl: currentStand.imageUrl,
            isActive: currentStand.active,
          });
          setStandId(currentStand.id);
        } else {
          setError("Tidak ada data stand yang ditemukan.");
        }
      } catch (err) {
        // TANGKAP ERROR ABAC
        if (err.isAbacError) {
          setAbacError(err.message);
        } else {
          setError("Gagal memuat data stand.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStandData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStandData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (newActiveState) => {
    setStandData(prev => ({ ...prev, isActive: newActiveState }));
  };
  
  const handleImageSelect = (file) => {
    setImageFile(file);
  };

  // --- 2. Implementasi fungsi Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!standId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('name', standData.name);
    formData.append('description', standData.description);
    formData.append('active', standData.isActive);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await updateStand(standId, formData);
      
      setStandData({
         name: response.data.name,
         description: response.data.description || '',
         imageUrl: response.data.imageUrl,
         isActive: response.data.active,
      });
      setImageFile(null);
      setSuccess("Perubahan berhasil disimpan!");
    } catch (err) {
      // TANGKAP ERROR ABAC SAAT MENYIMPAN
      if (err.isAbacError) {
        alert(`Akses ditolak: ${err.message}`);
      } else {
        setError("Gagal menyimpan perubahan.");
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  // --- 3. UI GUARD: Tampilkan halaman error jika terkena ABAC ---
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
            Kantin sedang di luar jam operasional. Pengaturan stand ditutup sementara.
          </div>
        </div>
      </div>
    );
  }

  // --- 4. Tampilkan Loading / Error / Konten Utama ---
  if (loading) {
    return <div className="p-4 text-center">Memuat pengaturan...</div>;
  }

  if (error && !standData) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }
  
  if (!standData) {
    return null; 
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Pengaturan Stand</h1>
      <p className="text-gray-500 mt-1 mb-6">Kelola informasi dasar stand Anda</p>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{success}</div>}
        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700">Informasi Stand</h2>
            <p className="text-sm text-gray-500 mt-1">Update detail stand Anda yang akan ditampilkan kepada pelanggan.</p>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Stand / Logo</label>
            <ImageUploader 
              initialImage={standData.imageUrl} 
              onImageSelect={handleImageSelect}
            />
        </div>

        <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Stand</label>
            <input 
                type="text" 
                id="name"
                name="name"
                value={standData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi Stand</label>
            <textarea 
                id="description"
                name="description"
                rows="4"
                value={standData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
            <p className="mt-2 text-xs text-gray-500">Deskripsi ini akan membantu pelanggan mengenal stand Anda lebih baik.</p>
        </div>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-900">Status Operasional</label>
            <div className="flex items-center justify-between mt-2">
                <div>
                    <h3 className="font-semibold">{standData.isActive ? "Stand Buka" : "Stand Tutup"}</h3>
                    <p className="text-sm text-gray-500">
                        {standData.isActive 
                            ? "Stand Anda sedang menerima pesanan."
                            : "Stand Anda sedang tidak menerima pesanan."
                        }
                    </p>
                </div>
                <ToggleSwitch 
                  isOn={standData.isActive} 
                  handleToggle={handleToggle} 
                />
            </div>
        </div>

        <div className="flex justify-end">
            <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default StandSettings;
