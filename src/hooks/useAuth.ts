/**
 * Authentication hook using Devv SDK
 */

import { useState, useEffect } from 'react';
import { authService } from '@/lib/sdk';
import type { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isLoggedIn()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, code: string) => {
    const user = await authService.verifyOTP(email, code);
    authService.storeUser(user);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('DEVV_USER');
    localStorage.removeItem('DEVV_SIGNING_KEY');
    setUser(null);
  };

  const sendOTP = async (email: string) => {
    await authService.sendOTP(email);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    sendOTP
  };
}
