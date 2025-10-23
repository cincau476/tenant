import React, { useState, useEffect } from 'react'; // <-- Impor useEffect
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';
import { getStands, updateStand } from '../api/apiService'; // <-- Impor API

const StandSettings = () => {
  // Hapus data dummy
  const [standData, setStandData] = useState(null);
  const [standId, setStandId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- 1. Ambil data stand saat komponen dimuat ---
  useEffect(() => {
    const fetchStandData = async () => {
      try {
        setLoading(true);
        // getStands() akan mengembalikan stand yg relevan
        // (1 untuk seller, banyak untuk admin)
        const response = await getStands();
        
        if (response.data && response.data.length > 0) {
          const currentStand = response.data[0];
          // Set data stand dari backend
          setStandData({
            name: currentStand.name,
            description: currentStand.description || '',
            imageUrl: currentStand.imageUrl, // <-- 'imageUrl' dari serializer
            isActive: currentStand.active, // <-- 'active' dari model
          });
          setStandId(currentStand.id);
        } else {
          setError("Tidak ada data stand yang ditemukan.");
        }
      } catch (err) {
        setError("Gagal memuat data stand.");
        console.error(err);
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

  // handleToggle kini menerima nilai baru (true/false) berkat perbaikan di ToggleSwitch
  const handleToggle = (newActiveState) => {
    setStandData(prev => ({ ...prev, isActive: newActiveState }));
  };
  
  // Sederhanakan handleImageSelect, kita hanya perlu filenya.
  // ImageUploader akan menangani preview-nya sendiri.
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

    // Buat FormData untuk mengirim data
    const formData = new FormData();
    formData.append('name', standData.name);
    formData.append('description', standData.description);
    formData.append('active', standData.isActive); // <-- Backend field adalah 'active'

    // Hanya kirim gambar jika ada file baru
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // Panggil API
      const response = await updateStand(standId, formData);
      
      // Update state dengan data yg baru disimpan (terutama URL gambar baru)
      setStandData({
         name: response.data.name,
         description: response.data.description || '',
         imageUrl: response.data.imageUrl,
         isActive: response.data.active,
      });
      setImageFile(null); // Reset file
      setSuccess("Perubahan berhasil disimpan!");
    } catch (err) {
      setError("Gagal menyimpan perubahan.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // --- 3. Tampilkan Loading / Error ---
  if (loading) {
    return <div className="p-4 text-center">Memuat pengaturan...</div>;
  }

  if (error && !standData) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }
  
  if (!standData) {
    return null; // Atau tampilkan UI "stand tidak ditemukan"
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Pengaturan Stand</h1>
      <p className="text-gray-500 mt-1 mb-6">Kelola informasi dasar stand Anda</p>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {/* Tampilkan notifikasi Sukses / Error */}
        {success && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{success}</div>}
        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700">Informasi Stand</h2>
            <p className="text-sm text-gray-500 mt-1">Update detail stand Anda yang akan ditampilkan kepada pelanggan.</p>
        </div>

        {/* Komponen Image Uploader */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Stand / Logo</label>
            <ImageUploader 
              initialImage={standData.imageUrl} // <-- Data dari API
              onImageSelect={handleImageSelect}
            />
        </div>

        {/* Nama Stand */}
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

        {/* Deskripsi Stand */}
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
        
        {/* Status Operasional */}
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
                {/* --- 4. Perbaiki prop 'ToggleSwitch' --- */}
                <ToggleSwitch 
                  isOn={standData.isActive} 
                  handleToggle={handleToggle} 
                />
            </div>
        </div>


        {/* Tombol Simpan */}
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