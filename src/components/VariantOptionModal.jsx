import React, { useState } from 'react';
import { X } from 'lucide-react';

const VariantOptionModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, price });
      setName(''); // Reset form
      setPrice(0);
      onClose(); // Tutup modal
    } catch (err) {
      console.error("Gagal membuat opsi", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Tambah Opsi Varian Baru</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Opsi (cth: Level 1, Besar)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Harga Tambahan (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Isi 0 jika tidak ada biaya tambahan"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 rounded-md">
              Batal
            </button>
            <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantOptionModal;