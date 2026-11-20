import { apiClient } from './api';

export const dashboardApi = {
  async getOverview() {
    return await apiClient('/api/dashboard/overview', {
      method: 'GET',
    });
  },

  async getActivity(limit = 10) {
    return await apiClient(`/api/dashboard/activity?limit=${limit}`, {
      method: 'GET',
    });
  },
};
