import { apiClient } from './api';

export const authApi = {
  async register({ fullName, email, password }) {
    return await apiClient('/api/auth/register', {
      method: 'POST',
      body: { fullName, email, password },
    });
  },

  async login({ email, password }) {
    return await apiClient('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async logout() {
    return await apiClient('/api/auth/logout', {
      method: 'POST',
    });
  },

  async getMe() {
    return await apiClient('/api/auth/me', {
      method: 'GET',
    });
  },
};
