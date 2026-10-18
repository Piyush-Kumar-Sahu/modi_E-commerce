/**
 * Centralised API Client with JWT authentication, guest session tracking,
 * automatic token refreshing, and structured error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  results?: T;
  count?: number;
  total_pages?: number;
  current_page?: number;
  errors?: Record<string, string[]>;
  status_code?: number;
}

export class ApiError extends Error {
  statusCode: number;
  errors: Record<string, string[]>;
  userMessage: string;

  constructor(statusCode: number, userMessage: string, errors: Record<string, string[]> = {}) {
    super(userMessage);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.errors = errors;
  }
}

// Generate or get guest cart session token
export const getGuestSessionId = (): string => {
  let sessionId = localStorage.getItem('modiecommers_guest_session');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('modiecommers_guest_session', sessionId);
  }
  return sessionId;
};

// Token Storage Helpers
export const getAccessToken = (): string | null => localStorage.getItem('modiecommers_access_token');
export const getRefreshToken = (): string | null => localStorage.getItem('modiecommers_refresh_token');

export const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem('modiecommers_access_token', access);
  if (refresh) {
    localStorage.setItem('modiecommers_refresh_token', refresh);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('modiecommers_access_token');
  localStorage.removeItem('modiecommers_refresh_token');
};

/**
 * Core Request Dispatcher
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  // Attach JSON content-type if body is not FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Authorization header if access token exists
  const accessToken = getAccessToken();
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Attach guest session key
  headers.set('X-Cart-Session', getGuestSessionId());

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized (attempt token refresh once)
    if (response.status === 401 && !isRetry) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setTokens(data.access);
            return apiRequest<T>(endpoint, options, true);
          } else {
            clearTokens();
          }
        } catch {
          clearTokens();
        }
      }
    }

    // Parse response
    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      let friendlyMessage = 'We were unable to complete your request. Please try again.';
      let fieldErrors: Record<string, string[]> = {};

      if (typeof responseData === 'object' && responseData !== null) {
        if (responseData.message) {
          friendlyMessage = responseData.message;
        } else if (responseData.detail) {
          friendlyMessage = responseData.detail;
        }

        if (responseData.errors && typeof responseData.errors === 'object') {
          fieldErrors = responseData.errors;
        } else {
          // If responseData itself contains field errors
          Object.keys(responseData).forEach(k => {
            if (Array.isArray(responseData[k])) {
              fieldErrors[k] = responseData[k];
            }
          });
        }
      }

      if (response.status === 404) {
        friendlyMessage = responseData?.message || 'The requested resource was not found.';
      } else if (response.status === 403) {
        friendlyMessage = responseData?.message || 'You do not have permission to perform this action.';
      } else if (response.status >= 500) {
        friendlyMessage = responseData?.message || 'Our jewellery boutique service is temporarily experiencing an issue. Please try again shortly.';
      }

      throw new ApiError(response.status, friendlyMessage, fieldErrors);
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'The connection to our jewellery server timed out. Please check your internet connection.');
    }
    throw new ApiError(0, error.message || 'Network connection error. Please verify your connection.');
  }
}
