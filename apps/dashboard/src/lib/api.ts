import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string, role: 'business' | 'influencer') =>
    api.post('/auth/signup', { email, password, role }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  
  getCurrentUser: () =>
    api.get('/auth/me')
};

export const orders = {
  create: (data: any) =>
    api.post('/orders', data),
  
  getAll: () =>
    api.get('/orders'),
  
  get: (id: string) =>
    api.get(`/orders/${id}`),
  
  accept: (id: string) =>
    api.put(`/orders/${id}/accept`),
  
  deliver: (id: string) =>
    api.put(`/orders/${id}/deliver`),
  
  dispute: (id: string, reason: string) =>
    api.put(`/orders/${id}/dispute`, { reason }),
  
  complete: (id: string) =>
    api.put(`/orders/${id}/complete`),
  
  cancel: (id: string) =>
    api.put(`/orders/${id}/cancel`)
};

export const payments = {
  createIntent: (data: any) =>
    api.post('/payments/intent', data),
  
  confirm: (paymentId: string) =>
    api.post('/payments/confirm', { paymentId }),
  
  getMethods: () =>
    api.get('/payments/methods'),
  
  addMethod: (data: any) =>
    api.post('/payments/methods', data),
  
  removeMethod: (id: string) =>
    api.delete(`/payments/methods/${id}`),
  
  getBillingProfiles: () =>
    api.get('/payments/billing-profiles'),
  
  addBillingProfile: (data: any) =>
    api.post('/payments/billing-profiles', data),
  
  removeBillingProfile: (id: string) =>
    api.delete(`/payments/billing-profiles/${id}`)
};

export const influencers = {
  getAll: () =>
    api.get('/influencers'),
  
  get: (id: string) =>
    api.get(`/influencers/${id}`),
  
  create: (data: any) =>
    api.post('/influencers', data),
  
  update: (id: string, data: any) =>
    api.put(`/influencers/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/influencers/${id}`),
  
  updateServices: (id: string, services: any[]) =>
    api.put(`/influencers/${id}/services`, { services }),
  
  startVerification: (id: string) =>
    api.post(`/influencers/${id}/verify`),
  
  confirmVerification: (id: string, code: string) =>
    api.post(`/influencers/${id}/verify/confirm`, { code })
};

export const notifications = {
  getAll: () =>
    api.get('/notifications'),
  
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
  
  delete: (id: string) =>
    api.delete(`/notifications/${id}`)
};

export const support = {
  createTicket: (data: any) =>
    api.post('/support/tickets', data),
  
  getTickets: () =>
    api.get('/support/tickets'),
  
  getTicket: (id: string) =>
    api.get(`/support/tickets/${id}`),
  
  addMessage: (ticketId: string, message: string) =>
    api.post(`/support/tickets/${ticketId}/messages`, { message }),
  
  closeTicket: (id: string) =>
    api.put(`/support/tickets/${id}/close`)
};