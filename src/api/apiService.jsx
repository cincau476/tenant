// src/api/apiService.jsx
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 15000, // Tambah sedikit timeout untuk Tenant karena ada upload gambar (multipart)
  
  // SECURE CODING: WAJIB TRUE! 
  // 1. Agar browser mengirim HttpOnly Cookie (Refresh Token).
  // 2. Agar Django bisa memvalidasi CSRF Token untuk mencegah serangan forgery.
  withCredentials: true, 
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// ==========================================
// ANTI-RACE CONDITION (MUTEX LOCK)
// ==========================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use((config) => {
  // Disarankan menggunakan localStorage agar konsisten dengan Admin/Kasir.
  // Pastikan saat login, token disimpan dengan nama 'access_token'
  const token = localStorage.getItem('access_token');
  
  if (token) {
    // SECURE CODING: Ubah dari 'Token' menjadi 'Bearer' sesuai SimpleJWT Django
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// RESPONSE INTERCEPTOR (SILENT REFRESH)
// ==========================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Hindari infinite loop jika request ke /refresh gagal
    if (originalRequest.url.includes('/users/token/refresh/')) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        
        // JIKA SEDANG REFRESH: Antrekan
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({resolve, reject});
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return apiClient(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        // JIKA BELUM REFRESH: Kunci Gembok
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Minta access token baru via HttpOnly Cookie refresh_token
            const response = await axios.post(`${BASE_URL}/users/token/refresh/`, {}, {
                withCredentials: true 
            });
            
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            
            // Buka gembok & proses antrean
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem('access_token');
            // Tendang ke login jika sesi benar-benar habis (di atas 1 hari)
            window.location.href = '/login'; 
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    
    // Jangan bocorkan stack trace ke console di Production
    if (import.meta.env.MODE !== 'production') {
      console.error('Tenant API Error:', error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);


// ==========================================
// KUMPULAN FUNGSI API TENANT
// ==========================================

// --- Dashboard / Reports ---
export const getReportSummary = () => apiClient.get('/reports/summary/');
export const getDashboardStats = () => apiClient.get('/reports/summary/');

// --- Stands (Tenants) ---
export const getStands = () => apiClient.get('/tenants/stands/');
export const getStandDetails = (standId) => apiClient.get(`/tenants/stands/${standId}/`);

// --- Menu Items ---
export const getMenus = (standId) => apiClient.get(`/tenants/stands/${standId}/menus/`);

export const createMenu = (standId, data) => {
  return apiClient.post(`/tenants/stands/${standId}/menus/`, data, {
    // Axios otomatis akan mendeteksi FormData dan mengatur boundary Content-Type,
    // tetapi kita tetap mendefinisikannya demi kejelasan
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateMenu = (standId, menuId, data) => {
  return apiClient.patch(`/tenants/stands/${standId}/menus/${menuId}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteMenu = (standId, menuId) => apiClient.delete(`/tenants/stands/${standId}/menus/${menuId}/`);

// --- Variant Groups ---
export const getVariantGroups = (standId) => apiClient.get(`/tenants/stands/${standId}/variant-groups/`);
export const createVariantGroup = (standId, data) => apiClient.post(`/tenants/stands/${standId}/variant-groups/`, data);
export const deleteVariantGroup = (standId, groupId) => apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/`);

// --- Variant Options ---
export const createVariantOption = (standId, groupId, data) => apiClient.post(`/tenants/stands/${standId}/variant-groups/${groupId}/options/`, data);
export const deleteVariantOption = (standId, groupId, optionId) => apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/options/${optionId}/`);

// --- Orders ---
export const getOrders = () => apiClient.get('/orders/all/'); 
export const updateOrderStatus = (uuid, status) => apiClient.patch(`/orders/${uuid}/status/`, { status });

// --- Update Stand ---
export const updateStand = (id, data) => apiClient.patch(`/tenants/stands/${id}/`, data);

// --- Auth ---
// Pastikan komponen form login Anda memanggil ini dan menyimpan token ke localStorage
export const loginTenant = (credentials) => apiClient.post('/users/login/', credentials); 
export const checkAuth = () => apiClient.get('/users/check-auth/');
export const logout = () => apiClient.post('/users/logout/');

export default apiClient;