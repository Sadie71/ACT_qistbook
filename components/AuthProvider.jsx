'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { TOKEN_KEY, authFetch } from '@/lib/apiClient';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkUser = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
      }
    } catch (err) {
      console.error('Failed to check auth:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Protect routes client-side
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ['/', '/login', '/register', '/signup'];
      const isPublicRoute = publicRoutes.includes(pathname);
      const isAuthFormPage = pathname === '/login' || pathname === '/register' || pathname === '/signup';

      if (!user && !isPublicRoute) {
        router.replace('/login');
      } else if (user && isAuthFormPage) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    setUser(data.user);
    router.replace('/dashboard');
    return data;
  };

  const signup = async ({ name, email, password, shopName, shopType }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, shopName, shopType }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    setUser(data.user);
    router.replace('/dashboard');
    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser: checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
