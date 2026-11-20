import { apiClient } from './api';

export const problemApi = {
  async listProblems({ search, difficulty, topic, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (difficulty) params.set('difficulty', difficulty);
    if (topic) params.set('topic', topic);
    params.set('page', String(page));
    params.set('limit', String(limit));

    return apiClient(`/api/problems?${params.toString()}`);
  },

  async getProblem(slug) {
    return apiClient(`/api/problems/${encodeURIComponent(slug)}`);
  },
};
