/**
 * Centralised API Client with JWT authentication, guest session tracking,
 * automatic token refreshing, and structured error handling.
 */

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

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
  code?: string;
  isUnverified?: boolean;

  constructor(
    statusCode: number,
    userMessage: string,
    errors: Record<string, string[]> = {},
    code?: string
  ) {
    super(userMessage);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.errors = errors;
    this.code = code;
    this.isUnverified =
      code === 'email_not_verified' ||
      userMessage.toLowerCase().includes('verify your email');
  }
}

/**
 * Strips raw Python ErrorDetail, exception wrappers, or technical syntax from a string.
 */
export function cleanRawErrorString(input: any): string {
  if (input === null || input === undefined) return '';
  let str = typeof input === 'string' ? input : String(input);

  // Handle Python DRF ErrorDetail representations
  if (/ErrorDetail\s*\(/.test(str)) {
    const matches: string[] = [];
    const regex = /ErrorDetail\s*\(\s*string=['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match[1]) matches.push(match[1]);
    }
    if (matches.length > 0) {
      str = matches.join(' ');
    } else {
      str = str
        .replace(/ErrorDetail\s*\(\s*string=['"]?/g, '')
        .replace(/['"]?\s*,\s*code=['"][^'"]*['"]?\s*\)/g, '')
        .replace(/[\[\]]/g, '')
        .trim();
    }
  }

  // Strip array brackets or quotes if raw string looks like: ['Some error message']
  str = str.replace(/^\[\s*['"]?/, '').replace(/['"]?\s*\]$/, '').trim();

  // Strip raw Python dict representations: {'detail': '...'} or {'email': ['...']}
  if (str.startsWith('{') && str.endsWith('}')) {
    const detailMatch = str.match(/['"](?:detail|message)['"]\s*:\s*['"]([^'"]+)['"]/);
    if (detailMatch && detailMatch[1]) {
      str = detailMatch[1];
    }
  }

  // Remove leading/trailing stray quotes
  str = str.replace(/^['"]|['"]$/g, '').trim();

  // Detect and replace server tracebacks, HTML error pages, SQL errors, or code exceptions
  if (
    str.includes('Traceback (most recent call last)') ||
    str.includes('<!DOCTYPE') ||
    str.includes('<html') ||
    str.includes('Internal Server Error') ||
    str.includes('OperationalError') ||
    str.includes('ProgrammingError') ||
    str.includes('IntegrityError') ||
    str.includes('psycopg2') ||
    str.includes('django.db') ||
    str.includes('Exception at /')
  ) {
    return 'Our jewellery boutique service is temporarily experiencing an issue. Please try again shortly.';
  }

  return str;
}

/**
 * Transforms raw backend responses into clean, user-friendly, non-technical error messages.
 */
export function formatUserFriendlyErrorMessage(
  statusCode: number,
  rawMessage?: any,
  responseData?: any
): { userMessage: string; code?: string; fieldErrors: Record<string, string[]> } {
  const fieldErrors: Record<string, string[]> = {};
  let detectedCode: string | undefined = undefined;

  // Extract response code if present
  if (responseData && typeof responseData === 'object') {
    if (responseData.code) {
      detectedCode = String(responseData.code);
    } else if (responseData.errors && typeof responseData.errors === 'object' && responseData.errors.code) {
      detectedCode = String(responseData.errors.code);
    }
  }

  // Extract and clean field errors if present
  if (responseData && typeof responseData === 'object') {
    const errorSource =
      responseData.errors && typeof responseData.errors === 'object'
        ? responseData.errors
        : responseData;

    Object.keys(errorSource).forEach((key) => {
      if (['success', 'status_code', 'code'].includes(key)) return;
      const val = errorSource[key];
      if (Array.isArray(val)) {
        fieldErrors[key] = val.map((item) => cleanRawErrorString(item)).filter(Boolean);
      } else if (typeof val === 'string' && val.trim()) {
        fieldErrors[key] = [cleanRawErrorString(val)];
      }
    });
  }

  // Initial candidate message
  let candidate = cleanRawErrorString(
    rawMessage ||
      (responseData && (responseData.message || responseData.detail)) ||
      (Object.values(fieldErrors)[0] && Object.values(fieldErrors)[0][0]) ||
      ''
  );

  const lower = candidate.toLowerCase();
  const codeLower = (detectedCode || '').toLowerCase();

  // 1. Email Verification Requirement (Login flow)
  if (
    codeLower === 'email_not_verified' ||
    lower.includes('email verification is required') ||
    lower.includes('email_not_verified') ||
    lower.includes('verify your email') ||
    lower.includes('verification code sent to your email') ||
    lower.includes('please verify your account')
  ) {
    return {
      userMessage: 'Please verify your email address before signing in. Check your inbox for the verification code.',
      code: 'email_not_verified',
      fieldErrors,
    };
  }

  // 2. Invalid Credentials / Account Not Found
  if (
    lower.includes('no active account found') ||
    lower.includes('unable to log in with provided credentials') ||
    lower.includes('invalid credentials') ||
    lower.includes('incorrect password') ||
    (statusCode === 401 && !lower.includes('token') && !lower.includes('expired'))
  ) {
    return {
      userMessage: 'Invalid email or password. Please verify your credentials and try again.',
      code: detectedCode || 'invalid_credentials',
      fieldErrors,
    };
  }

  // 3. Network Failure / Offline / Connection Refused (status 0)
  if (
    statusCode === 0 ||
    lower.includes('failed to fetch') ||
    lower.includes('network error') ||
    lower.includes('networkerror')
  ) {
    return {
      userMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
      code: 'network_error',
      fieldErrors,
    };
  }

  // 4. Request Timeout / AbortError (status 408)
  if (
    statusCode === 408 ||
    lower.includes('timed out') ||
    lower.includes('timeout') ||
    lower.includes('aborterror')
  ) {
    return {
      userMessage: 'The request timed out. Please check your internet connection and try again.',
      code: 'timeout',
      fieldErrors,
    };
  }

  // 5. Server Errors (500, 502, 503, 504)
  if (statusCode >= 500) {
    return {
      userMessage: 'Our jewellery boutique service is temporarily experiencing an issue. Please try again shortly.',
      code: 'server_error',
      fieldErrors,
    };
  }

  // 6. Rate Limit (429)
  if (statusCode === 429 || lower.includes('rate limit') || lower.includes('too many requests')) {
    return {
      userMessage: 'Too many requests. Please wait a moment before trying again.',
      code: 'rate_limited',
      fieldErrors,
    };
  }

  // 7. Forbidden / Permission Denied (403)
  if (statusCode === 403 || lower.includes('permission') || lower.includes('forbidden')) {
    return {
      userMessage: candidate || 'You do not have permission to perform this action.',
      code: 'permission_denied',
      fieldErrors,
    };
  }

  // 8. Not Found (404)
  if (statusCode === 404) {
    return {
      userMessage: candidate || 'The requested resource could not be found.',
      code: 'not_found',
      fieldErrors,
    };
  }

  if (!candidate || candidate.length < 3) {
    candidate = 'We were unable to complete your request. Please try again.';
  }

  return {
    userMessage: candidate,
    code: detectedCode,
    fieldErrors,
  };
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
      const { userMessage, code, fieldErrors } = formatUserFriendlyErrorMessage(
        response.status,
        responseData?.message || responseData?.detail,
        responseData
      );

      throw new ApiError(response.status, userMessage, fieldErrors, code);
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new ApiError(
        408,
        'The request timed out. Please check your internet connection and try again.',
        {},
        'timeout'
      );
    }
    const { userMessage, code } = formatUserFriendlyErrorMessage(0, error.message);
    throw new ApiError(0, userMessage, {}, code || 'network_error');
  }
}
