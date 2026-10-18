import { apiRequest, setTokens, clearTokens } from './client';
import { User, Address } from '../types';

export interface RegisterResponse {
  success: boolean;
  requires_verification: boolean;
  email: string;
  message: string;
  email_sent?: boolean;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface GenericResponse {
  success: boolean;
  message: string;
  retry_after?: number;
}

export interface VerifyResetOTPResponse {
  success: boolean;
  message: string;
  reset_token: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ access: string; refresh: string; user: User }>('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.access, data.refresh);
    return data;
  },

  register: async (userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>('/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  verifyEmail: async (email: string, otp: string): Promise<VerifyOTPResponse> => {
    const data = await apiRequest<VerifyOTPResponse>('/accounts/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    if (data.tokens) {
      setTokens(data.tokens.access, data.tokens.refresh);
    }
    return data;
  },

  resendOTP: async (email: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>('/accounts/resend-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  forgotPassword: async (email: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>('/accounts/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetOTP: async (email: string, otp: string): Promise<VerifyResetOTPResponse> => {
    return apiRequest<VerifyResetOTPResponse>('/accounts/verify-reset-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resendResetOTP: async (email: string): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>('/accounts/resend-reset-otp/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  validateResetToken: async (uid: string, token: string): Promise<{ success: boolean; valid: boolean; email?: string; message?: string }> => {
    return apiRequest<{ success: boolean; valid: boolean; email?: string; message?: string }>('/accounts/validate-reset-token/', {
      method: 'POST',
      body: JSON.stringify({ uid, token }),
    });
  },

  resetPassword: async (payload: {
    uid?: string;
    token?: string;
    email?: string;
    reset_token?: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<GenericResponse> => {
    return apiRequest<GenericResponse>('/accounts/reset-password/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: () => {
    clearTokens();
  },

  getProfile: async () => {
    const res = await apiRequest<{ success: boolean; data: User }>('/accounts/me/');
    return res.data;
  },

  updateProfile: async (profileData: Partial<User>) => {
    const res = await apiRequest<{ success: boolean; data: User }>('/accounts/me/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    return res.data;
  },

  changePassword: async (passwords: { old_password: string; new_password: string; new_password_confirm: string }) => {
    return apiRequest<{ success: boolean; message: string }>('/accounts/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  },

  // Address Book APIs
  getAddresses: async () => {
    const res = await apiRequest<{ results: Address[] } | Address[]>('/accounts/addresses/');
    return Array.isArray(res) ? res : res.results || [];
  },

  addAddress: async (address: Omit<Address, 'id'>) => {
    return apiRequest<Address>('/accounts/addresses/', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  updateAddress: async (id: number, address: Partial<Address>) => {
    return apiRequest<Address>(`/accounts/addresses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(address),
    });
  },

  deleteAddress: async (id: number) => {
    return apiRequest<{ success: boolean }>(`/accounts/addresses/${id}/`, {
      method: 'DELETE',
    });
  },
};
