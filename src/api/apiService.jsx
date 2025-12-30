// src/api/apiService.jsx
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL, 
  timeout: 10000,
  withCredentials: true,
});

/**
 * Interceptor untuk menyisipkan tenant_token
 */
apiClient.interceptors.request.use((config) => {
  // MENGGUNAKAN tenant_token AGAR TIDAK BENTROK DENGAN ADMIN
  const token = localStorage.getItem('tenant_token');
  
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Kumpulan Fungsi API ---

// --- Dashboard / Reports ---
/**
 * Mengambil data ringkasan dashboard.
 * Endpoint: /api/reports/summary/
 */
export const getReportSummary = () => {
  return apiClient.get('/reports/summary/');
};

export const getDashboardStats = () => {
  return apiClient.get('/reports/summary/');
};

// --- Stands (Tenants) ---
/**
 * Mengambil daftar stand milik seller yang login.
 * SESUAI BACKEND: /api/tenants/stands/
 */
export const getStands = () => apiClient.get('/tenants/stands/');

/**
 * Mengambil detail satu stand.
 */
export const getStandDetails = (standId) => {
  return apiClient.get(`/tenants/stands/${standId}/`);
};

// --- Menu Items ---
/**
 * Mengambil daftar menu untuk stand tertentu.
 * SESUAI BACKEND: /api/tenants/stands/<id>/menus/
 */
export const getMenus = (standId) => {
  return apiClient.get(`/tenants/stands/${standId}/menus/`);
};

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

export const deleteMenu = (standId, menuId) => {
  return apiClient.delete(`/tenants/stands/${standId}/menus/${menuId}/`);
};

// --- Variant Groups ---
export const getVariantGroups = (standId) => {
  return apiClient.get(`/tenants/stands/${standId}/variant-groups/`);
};

export const createVariantGroup = (standId, data) => {
  return apiClient.post(`/tenants/stands/${standId}/variant-groups/`, data);
};

export const deleteVariantGroup = (standId, groupId) => {
  return apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/`);
};

// --- Variant Options ---
export const createVariantOption = (standId, groupId, data) => {
  return apiClient.post(`/tenants/stands/${standId}/variant-groups/${groupId}/options/`, data);
};

export const deleteVariantOption = (standId, groupId, optionId) => {
  return apiClient.delete(`/tenants/stands/${standId}/variant-groups/${groupId}/options/${optionId}/`);
};

// --- Orders ---
/**
 * Mengambil semua pesanan untuk tenant terkait.
 * SESUAI BACKEND: /api/orders/all/
 */
export const getOrders = () => {
  return apiClient.get('/orders/all/'); 
};

// Fungsi ini akan memanggil http://localhost:8000/api/orders/<uuid>/status/
export const updateOrderStatus = (uuid, status) => {
  return apiClient.patch(`/orders/${uuid}/status/`, { status });
};

export const updateStand = (id, data) => apiClient.patch(`/tenants/stands/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default apiClient;
