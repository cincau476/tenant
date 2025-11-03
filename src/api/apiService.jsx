import axios from 'axios';

/**
 * Mengambil token autentikasi dari localStorage.
 * Asumsinya, Anda menyimpan token di sini setelah user login.
 */
const getAuthToken = () => localStorage.getItem('authToken');

/**
 * Instance Axios utama untuk semua request API
 */
const apiClient = axios.create({
  // Sesuaikan baseURL ini dengan alamat backend Django Anda
  baseURL: 'http://localhost:8000/api', 
  timeout: 10000,
});

/**
 * Interceptor ini akan "mencegat" setiap request dan menyisipkan
 * header 'Authorization' secara otomatis jika token ada.
 */
apiClient.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      // Backend Django REST Framework TokenAuth menggunakan format 'Token <token>'
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// --- Kumpulan Fungsi API ---

// --- Auth ---

/**
 * Melakukan login ke backend.
 * Endpoint: /token-auth/
 */
export const login = (username, password) => {
  return apiClient.post('/token-auth/', { username, password });
};

// --- Dashboard / Reports ---

/**
 * Mengambil data ringkasan dashboard dari backend.
 * Endpoint: reports/summary/
 */
export const getReportSummary = () => {
  return apiClient.get('/reports/summary/');
};

// --- Stands (Tenants) ---

/**
 * Mengambil daftar stand.
 * Backend akan otomatis memfilter:
 * - Admin: dapat semua stand
 * - Seller: dapat stand miliknya
 * Endpoint: /stands/
 */
export const getStands = () => {
  return apiClient.get('/stands/');
};

// --- Menus ---

/**
 * Mengambil semua menu untuk stand tertentu.
 * Endpoint: /stands/<standId>/menus/
 */
export const getMenus = (standId) => {
  return apiClient.get(`/stands/${standId}/menus/`);
};

/**
 * Mengupdate sebagian data menu item (misal: status 'available').
 * Endpoint: /stands/<standId>/menus/<menuId>/
 * Method: PATCH
 */
export const updateMenu = (standId, menuId, data) => {
  // 'data' bisa berupa { "available": false } atau { "price": 26000 }
  return apiClient.patch(`/stands/${standId}/menus/${menuId}/`, data);
};

/**
 * Mengupdate data stand (tenant).
 * Endpoint: /stands/<standId>/
 * Method: PATCH (dengan FormData)
 */
export const updateStand = (standId, formData) => {
  return apiClient.patch(`/stands/${standId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Menghapus menu item.
 * Endpoint: /stands/<standId>/menus/<menuId>/
 * Method: DELETE
 */
export const deleteMenu = (standId, menuId) => {
  return apiClient.delete(`/stands/${standId}/menus/${menuId}/`);
};

// --- TAMBAHKAN FUNGSI INI ---
/**
 * Membuat menu item baru (dengan upload gambar).
 * Endpoint: /stands/<standId>/menus/
 * Method: POST
 * Data: FormData
 */
export const createMenu = (standId, formData) => {
  return apiClient.post(`/stands/${standId}/menus/`, formData, {
    headers: {
      // 'Content-Type': 'multipart/form-data' diatur otomatis oleh browser
      // saat mengirimkan FormData dengan Axios.
    },
  });
};
// --- AKHIR TAMBAHAN ---

/**
 * Mengambil semua variant group untuk stand tertentu.
 * Endpoint: /stands/<standId>/variant-groups/
 */
export const getVariantGroups = (standId) => {
  return apiClient.get(`/stands/${standId}/variant-groups/`);
};

/**
 * Membuat variant group baru.
 * Endpoint: /stands/<standId>/variant-groups/
 */
export const createVariantGroup = (standId, name) => {
  return apiClient.post(`/stands/${standId}/variant-groups/`, { name });
};

/**
 * Menghapus variant group.
 * Endpoint: /stands/<standId>/variant-groups/<groupId>/
 */
export const deleteVariantGroup = (standId, groupId) => {
  return apiClient.delete(`/stands/${standId}/variant-groups/${groupId}/`);
};

// --- Variant Options ---

/**
 * Membuat variant option baru di dalam group.
 * Endpoint: /stands/<standId>/variant-groups/<groupId>/options/
 */
export const createVariantOption = (standId, groupId, data) => {
  // data = { name: "...", price: "..." }
  return apiClient.post(`/stands/${standId}/variant-groups/${groupId}/options/`, data);
};

/**
 * Menghapus variant option.
 * Endpoint: /stands/<standId>/variant-groups/<groupId>/options/<optionId>/
 */
export const deleteVariantOption = (standId, groupId, optionId) => {
  return apiClient.delete(`/stands/${standId}/variant-groups/${groupId}/options/${optionId}/`);
};
// --- Orders ---

/**
 * Mengambil semua pesanan yang relevan untuk user yang login.
 * (Backend akan otomatis memfilter berdasarkan tenant jika user adalah Seller)
 * Endpoint: /orders/all/
 */
export const getOrders = () => {
  return apiClient.get('/all/');
};

/**
 * Mengupdate status sebuah order.
 * Endpoint: /orders/<uuid>/update-status/
 * Method: PATCH
 */
export const updateOrderStatus = (orderUuid, newStatus) => {
  // Backend UpdateOrderStatusView mengharapkan 'PATCH'
  // dengan body: { "status": "NAMA_STATUS_BARU" }
  return apiClient.patch(`/orders/${orderUuid}/update-status/`, {
    status: newStatus,
  });
};