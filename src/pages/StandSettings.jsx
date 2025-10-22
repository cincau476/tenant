import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ToggleSwitch from '../components/ToggleSwitch';

const StandSettings = () => {
  // State untuk menyimpan data form. Idealnya, ini diambil dari API.
  const [standData, setStandData] = useState({
    name: 'Warung Bu Siti',
    description: 'Menyajikan masakan rumahan dengan cita rasa autentik dan harga terjangkau. Spesialisasi kami adalah nasi goreng spesial dan ayam geprek yang selalu menjadi favorit pelanggan.',
    imageUrl: 'https://img.logoipsum.com/243.svg', // URL gambar awal
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStandData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (isActive) => {
    setStandData(prev => ({ ...prev, isActive }));
  };
  
  const handleImageSelect = (file) => {
    setImageFile(file);
    // PERBAIKAN: Tambahkan pengecekan untuk memastikan file tidak null
    if (file) {
      setStandData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    } else {
      // Jika file null (dihapus), set imageUrl ke null juga
      setStandData(prev => ({ ...prev, imageUrl: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Di sini Anda akan mengirim data ke backend.
    // Jika ada imageFile baru, Anda akan mengirimnya sebagai FormData.
    console.log('Data yang akan dikirim:', standData);
    if (imageFile) {
      console.log('File gambar baru:', imageFile);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Pengaturan Stand</h1>
      <p className="text-gray-500 mt-1 mb-6">Kelola informasi dasar stand Anda</p>
      
      <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700">Informasi Stand</h2>
            <p className="text-sm text-gray-500 mt-1">Update detail stand Anda yang akan ditampilkan kepada pelanggan.</p>
        </div>

        {/* Komponen Image Uploader */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Stand / Logo</label>
            <ImageUploader 
              initialImage={standData.imageUrl} 
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
                <ToggleSwitch enabled={standData.isActive} onToggle={handleToggle} />
            </div>
        </div>


        {/* Tombol Simpan */}
        <div className="flex justify-end">
            <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Simpan Perubahan
            </button>
        </div>
      </form>
    </div>
  );
};

export default StandSettings;

