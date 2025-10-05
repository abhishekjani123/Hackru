import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// Inventory
export const inventoryAPI = {
  getAll: (params?: any) => api.get('/api/inventory', { params }),
  getLowStock: () => api.get('/api/inventory/low-stock'),
  getOne: (id: string) => api.get(`/api/inventory/${id}`),
  create: (data: any) => api.post('/api/inventory', data),
  update: (id: string, data: any) => api.put(`/api/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/api/inventory/${id}`),
};

// Vendors
export const vendorsAPI = {
  getAll: (params?: any) => api.get('/api/vendors', { params }),
  getOne: (id: string) => api.get(`/api/vendors/${id}`),
  create: (data: any) => api.post('/api/vendors', data),
  update: (id: string, data: any) => api.put(`/api/vendors/${id}`, data),
  delete: (id: string) => api.delete(`/api/vendors/${id}`),
  compare: (data: any) => api.post('/api/vendors/compare', data),
};

// Vendor Discovery
export const vendorDiscoveryAPI = {
  search: (data: any) => api.post('/api/vendor-discovery/search', data),
  getVendorDetails: (source: string, vendorName: string) => 
    api.get(`/api/vendor-discovery/vendor-details/${source}/${vendorName}`),
  compare: (data: any) => api.post('/api/vendor-discovery/compare', data),
};

// Purchase Orders
export const purchaseOrdersAPI = {
  getAll: (params?: any) => api.get('/api/purchase-orders', { params }),
  getOne: (id: string) => api.get(`/api/purchase-orders/${id}`),
  create: (data: any) => api.post('/api/purchase-orders', data),
  update: (id: string, data: any) => api.put(`/api/purchase-orders/${id}`, data),
  approve: (id: string) => api.post(`/api/purchase-orders/${id}/approve`),
  receive: (id: string) => api.post(`/api/purchase-orders/${id}/receive`),
  cancel: (id: string) => api.post(`/api/purchase-orders/${id}/cancel`),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getSpendingTrends: (period?: number) => api.get('/api/analytics/spending-trends', { params: { period } }),
  getInventoryInsights: () => api.get('/api/analytics/inventory-insights'),
};

// AI
export const aiAPI = {
  recommendPurchase: () => api.post('/api/ai/recommend-purchase', {}),
  generateOrder: (data: any) => api.post('/api/ai/generate-order', data),
  getInventoryInsights: () => api.get('/api/ai/inventory-insights'),
  getVendorAnalysis: (vendorId: string) => api.get(`/api/ai/vendor-analysis/${vendorId}`),
};

export default api;
