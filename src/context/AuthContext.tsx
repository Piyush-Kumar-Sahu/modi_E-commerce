import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi, RegisterResponse, VerifyOTPResponse } from '../api/auth';
import { getAccessToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (data: any) => Promise<RegisterResponse>;
  verifyEmail: (email: string, otp: string) => Promise<VerifyOTPResponse>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
      authApi.logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await authApi.login(email, pass);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any): Promise<RegisterResponse> => {
    return await authApi.register(data);
  };

  const verifyEmail = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
    const res = await authApi.verifyEmail(email, otp);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!(user && (user.is_superuser || user.is_staff || user.role === 'admin')),
    login,
    register,
    verifyEmail,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
