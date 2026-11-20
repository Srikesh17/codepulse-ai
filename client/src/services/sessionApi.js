import { apiClient } from './api';

export const sessionApi = {
  async startSession(problemId) {
    return apiClient('/api/sessions', {
      method: 'POST',
      body: { problemId },
    });
  },

  async getSession(sessionId) {
    return apiClient(`/api/sessions/${sessionId}`);
  },

  async getSessions() {
    return apiClient('/api/sessions');
  },

  async saveDraft(sessionId, code, version, language = 'python') {
    return apiClient(`/api/sessions/${sessionId}/draft`, {
      method: 'PUT',
      body: { code, version, language },
    });
  },

  async createAttempt(sessionId, code, attemptType = 'manual_snapshot', language = 'python') {
    return apiClient(`/api/sessions/${sessionId}/attempts`, {
      method: 'POST',
      body: { code, attemptType, language },
    });
  },

  async getAttempts(sessionId) {
    return apiClient(`/api/sessions/${sessionId}/attempts`);
  },
};
