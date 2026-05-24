// src/components/MfaSetupModal.jsx

import React, { useState, useEffect } from 'react';
import * as api from '../api/apiService.jsx';

export default function MfaSetupModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: QR Code, 2: Backup Codes
  const [qrImage, setQrImage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pemicu awal untuk mengambil QR Code dari backend
  useEffect(() => {
    if (isOpen) {
      handleGenerateMfa();
    } else {
      // Reset state saat modal ditutup
      setStep(1);
      setQrImage('');
      setOtpCode('');
      setBackupCodes([]);
      setError('');
    }
  }, [isOpen]);

  const handleGenerateMfa = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.generateMfaSetup();
      // Axios menyimpan payload di dalam properti .data
      setQrImage(response.data.qr_code_base64);
      setSecretKey(response.data.secret_key);
    } catch (err) {
      // Menangkap pesan error detail dari Django
      setError(err.response?.data?.detail || 'Gagal memuat QR Code MFA.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.verifyMfaSetup(otpCode);
      // Axios menyimpan payload di dalam properti .data
      setBackupCodes(response.data.backup_codes || []);
      setStep(2); // Pindah ke langkah menampilkan backup codes
      
      // Kirim sinyal sukses agar halaman utama auto-refresh
      if (onSuccess) onSuccess(); 
    } catch (err) {
      // Menangkap pesan error detail dari Django
      setError(err.response?.data?.detail || 'Kode OTP salah atau kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 text-left animate-fadeIn">
        
        {/* HEADER */}
        <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Keamanan Autentikasi Dua Faktor (MFA)</h3>
          {step === 1 && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl font-semibold">&times;</button>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 mt-2 font-medium">Memproses...</p>
            </div>
          )}

          {!loading && step === 1 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Pindai QR Code di bawah ini menggunakan aplikasi **Google Authenticator** atau **Microsoft Authenticator** di ponsel Anda.
              </p>
              
              {qrImage && (
                <div className="inline-block bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
                  <img src={qrImage} alt="MFA QR Code" className="w-48 h-48 mx-auto" />
                </div>
              )}

              {secretKey && (
                <div className="text-xs text-gray-500 mb-6 bg-gray-50 py-2 px-3 rounded-lg border border-dashed border-gray-300">
                  <span className="font-semibold block text-gray-600 mb-1">Gagal scan? Input manual:</span>
                  <code className="text-orange-600 font-mono text-sm tracking-wider select-all">{secretKey}</code>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-left text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Masukkan 6-Digit Kode OTP
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Contoh: 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-center text-xl tracking-widest text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpCode.length !== 6}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verifikasi & Aktifkan
                </button>
              </form>
            </div>
          )}

          {!loading && step === 2 && (
            <div>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-4 text-xs font-medium">
                ⚠️ **PENTING: SIMPAN KODE CADANGAN INI!** Kode ini hanya ditampilkan sekali. Gunakan salah satu kode di bawah ini jika ponsel Anda hilang atau tidak bisa menerima OTP.
              </div>
              
              <div className="grid grid-cols-2 gap-2 bg-gray-900 p-4 rounded-xl font-mono text-center text-sm text-green-400 mb-6 border border-gray-800">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="bg-gray-800/50 py-2 rounded-lg tracking-wider border border-gray-700/30 select-all">
                    {code}
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 shadow-md transition-all"
              >
                Selesai & Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
