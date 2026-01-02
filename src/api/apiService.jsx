// src/api/apiService.jsx
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,
  // PENTING: Set ke false. Kita hanya mengandalkan Token, bukan Cookie.
  // Ini akan mematikan pemeriksaan CSRF di Django.
  withCredentials: false, 
});

/**
 * Interceptor untuk menyisipkan tenant_token
 */
apiClient.interceptors.request.use((config) => {
  // Ambil token dari storage
  const token = sessionStorage.getItem('tenant_token');
  
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  
  // Kita TIDAK perlu lagi menyisipkan X-CSRFToken secara manual
  // karena withCredentials=false (Cookie tidak dikirim).
  
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

// --- Update Stand ---
// Biarkan Axios mengatur Content-Type otomatis (multipart/form-data) karena kita kirim FormData
export const updateStand = (id, data) => apiClient.patch(`/tenants/stands/${id}/`, data);

export const checkAuth = () => apiClient.get('/users/check-auth/');
export const logout = () => apiClient.post('/users/logout/');

export default apiClient;
