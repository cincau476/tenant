// src/api/apiService.jsx
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 15000, 
  withCredentials: true, 
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

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
  // PERBAIKAN 1: Sesuai dengan aplikasi Login utama (LoginPage.jsx)
  // Gunakan 'tenant_token' BUKAN 'access_token'
  const token = sessionStorage.getItem('tenant_token');
  
  if (token) {
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
  (response) => {
    if (response.data && response.data.results !== undefined) {
      response.data = response.data.results;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // --- PERBAIKAN: TANGKAP ERROR 403 ABAC DI SINI ---
    if (error.response?.status === 403) {
      const errorMessage = error.response.data?.detail || error.response.data?.message || '';
      
      // Deteksi jika ini adalah penolakan dari sistem ABAC
      if (typeof errorMessage === 'string' && errorMessage.includes('ABAC DENY')) {
        // Kembalikan format error khusus agar komponen tidak crash
        return Promise.reject({
          isAbacError: true,
          message: errorMessage
        });
      }
    }
    // -------------------------------------------------

    if (originalRequest.url.includes('/users/token/refresh/')) {
        return Promise.reject(error);
    }

    // Blok 401 Silent Refresh Anda (Tetap utuh)
    if (error.response?.status === 401 && !originalRequest._retry) {
        
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

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axios.post(`${BASE_URL}/users/token/refresh/`, {}, {
                withCredentials: true 
            });
            
            const newAccessToken = response.data.access;
            sessionStorage.setItem('tenant_token', newAccessToken);
            
            apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            sessionStorage.removeItem('tenant_token');
            sessionStorage.removeItem('tenant_user');
            window.location.href = `${window.location.origin}/login`; 
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// KUMPULAN FUNGSI API TENANT
// ==========================================
export const getReportSummary = () => apiClient.get('/orders/reports/summary/');
export const getDashboardStats = () => apiClient.get('/orders/reports/summary/');

export const getStands = () => apiClient.get('/tenants/stands/');
export const getStandDetails = (standId) => apiClient.get(`/tenants/stands/${standId}/`);

export const getMenus = (standId) => apiClient.get(`/tenants/stands/${standId}/menus/`);

export const createMenu = (standId, data) => {
  return apiClient.post(`/tenants/stands/${standId}/menus/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateMenu = (standId, menuId, data) => {
  return apiClient.patch(`/tenants/stands/${standId}/menus/${menuId}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteMenu = (standId, menuId) => apiClient.delete(`/tenants/stands/${standId}/menus/${menuId}/`);

export const getVariantGroups = (standId) => apiClient.get(`/tenants/stands/${standId}/variant-groups/`);
export const createVariantGroup = (standId, data) => apiClient.post(`/tenants/stands/${standId}/variant-groups/`, data);
export const deleteVariantGroup = (standId, groupId) => apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/`);

export const createVariantOption = (standId, groupId, data) => apiClient.post(`/tenants/stands/${standId}/variant-groups/${groupId}/options/`, data);
export const deleteVariantOption = (standId, groupId, optionId) => apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/options/${optionId}/`);

export const getOrders = () => apiClient.get('/orders/all/'); 
export const updateOrderStatus = (uuid, status) => apiClient.patch(`/orders/${uuid}/status/`, { status });

export const updateStand = (id, data) => apiClient.patch(`/tenants/stands/${id}/`, data);

export const loginTenant = (credentials) => apiClient.post('/users/login/', credentials); 
export const checkAuth = () => apiClient.get('/users/check-auth/');
export const logout = async () => {
  try {
    // Kirim sinyal logout ke backend dengan body kosong
    // (Browser akan otomatis melampirkan HttpOnly Cookie jika ada)
    await apiClient.post('/users/logout/', {});
  } catch (error) {
    // Telan error 400/401 agar tidak membuat aplikasi React panik
    console.warn("Sesi backend sudah kedaluwarsa atau token ada di cookie. Melanjutkan pembersihan lokal...");
  } finally {
    // Apapun yang terjadi di backend, WAJIB hapus token di browser
    sessionStorage.removeItem('tenant_token');
    sessionStorage.removeItem('tenant_user');
  }
};

// === MFA Keamanan ===
export const generateMfaSetup = () => apiClient.post('/users/mfa/setup/generate/');

export const verifyMfaSetup = (otpCode) => apiClient.post('/users/mfa/setup/verify/', { 
    otp_code: otpCode 
});
export default apiClient;
