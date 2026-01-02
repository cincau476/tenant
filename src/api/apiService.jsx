// src/api/apiService.jsx
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,
  withCredentials: true, // Ini mengirim cookie, jadi kita WAJIB handle CSRF
});

/**
 * Fungsi Helper untuk mengambil nilai Cookie (Standar Django)
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Interceptor Request
 * 1. Sisipkan Token Authorization (jika ada)
 * 2. Sisipkan X-CSRFToken (Wajib jika withCredentials: true)
 */
apiClient.interceptors.request.use((config) => {
  // 1. Handle Auth Token (Tenant Token)
  const token = sessionStorage.getItem('tenant_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  // 2. Handle CSRF Token (PENTING untuk PATCH/POST/DELETE)
  // Kita ambil dari cookie bernama 'csrftoken' (default Django)
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Kumpulan Fungsi API ---

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

// --- Update Stand (PERBAIKAN HEADER) ---
// Note: Jangan manual set Content-Type multipart di sini jika pakai FormData,
// Biarkan Axios yang set Boundary-nya. Tapi kalau mau manual, pastikan benar.
// Code di bawah ini aman karena header Auth & CSRF diurus Interceptor.
export const updateStand = (id, data) => apiClient.patch(`/tenants/stands/${id}/`, data);

export const checkAuth = () => apiClient.get('/users/check-auth/');
export const logout = () => apiClient.post('/users/logout/');

export default apiClient;
