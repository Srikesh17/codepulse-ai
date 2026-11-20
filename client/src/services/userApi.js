import { apiClient } from './api';

export const userApi = {
  async getProfile() {
    return await apiClient('/api/users/me', {
      method: 'GET',
    });
  },

  async updateProfile(updates) {
    return await apiClient('/api/users/me', {
      method: 'PATCH',
      body: updates,
    });
  },
};
