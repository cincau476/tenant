let cachedLocation = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // Cache valid selama 5 menit

export const getClientLocation = () => {
  return new Promise((resolve) => {
    const now = Date.now();
    
    // Gunakan cache jika masih valid untuk mencegah latency pada setiap API call
    if (cachedLocation && (now - lastFetchTime) < CACHE_TTL) {
      return resolve(cachedLocation);
    }

    if (!navigator.geolocation) {
      console.warn("Geolocation tidak didukung oleh browser ini.");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        cachedLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        lastFetchTime = now;
        resolve(cachedLocation);
      },
      (error) => {
        console.error("Gagal mengambil lokasi untuk ABAC:", error.message);
        resolve(null); // Fallback agar request tetap berjalan (atau handle sesuai aturan bisnis)
      },
      {
        enableHighAccuracy: false, // Set false untuk kecepatan dan akurasi standar
        timeout: 5000,
        maximumAge: CACHE_TTL,
      }
    );
  });
};
