/**
 * Base API Client for CodePulse AI
 * Uses native fetch with credentials: 'include' for HttpOnly cookies.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('codepulse_token') : null;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-CodePulse-Client': 'web',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // essential for transmitting HttpOnly authentication cookie
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;

      // On 401 on protected resources (not initial auth check or login/signup), notify session expiration
      if (response.status === 401) {
        localStorage.removeItem('codepulse_demo_mode');
        // Only trigger session expiration for requests outside of /api/auth/
        if (!endpoint.includes('/api/auth/')) {
          localStorage.removeItem('codepulse_token');
          window.dispatchEvent(new CustomEvent('codepulse:session-expired'));
        }
      }

      throw new ApiError(errorMessage, response.status, data?.details);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network errors, server offline, or CORS failure
    throw new ApiError(
      'Unable to connect to CodePulse backend server. Please check your network or backend status.',
      0
    );
  }
}
