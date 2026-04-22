'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as apiClient from './api';
import { Role } from './permissions';

export interface AuthUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role?: { id: number; name: Role };
  department?: { id: number; name: string } | null;
}

interface RawUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role?: { id: number; name: string } | string;
  department?: { id: number; name: string } | string | null;
}

function normalizeUser(raw: RawUser | null | undefined): AuthUser | null {
  if (!raw) return null;
  const role =
    typeof raw.role === 'string'
      ? { id: 0, name: raw.role as Role }
      : raw.role
        ? { id: raw.role.id, name: raw.role.name as Role }
        : undefined;
  const department =
    typeof raw.department === 'string'
      ? { id: 0, name: raw.department }
      : raw.department ?? null;
  return {
    id: raw.id,
    username: raw.username,
    name: raw.name,
    email: raw.email,
    role,
    department,
  };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  roleName: Role | null;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          /* ignore */
        }
      }
      apiClient
        .me()
        .then((res) => {
          const u = normalizeUser(res.data?.user || res.data);
          if (u) {
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await apiClient.login(username, password);
    const data = res.data || {};
    const newToken: string = data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Fetch full user from /me for consistent role/department object shape
    let newUser = normalizeUser(data.user || data);
    try {
      const meRes = await apiClient.me();
      const full = normalizeUser(meRes.data?.user || meRes.data);
      if (full) newUser = full;
    } catch {
      /* ignore — use the login response */
    }
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    }
    return newUser as AuthUser;
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const refresh = async () => {
    try {
      const res = await apiClient.me();
      const u = normalizeUser(res.data?.user || res.data);
      if (u) {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      }
    } catch {
      /* ignore */
    }
  };

  const roleName = (user?.role?.name as Role) || null;

  return (
    <AuthContext.Provider value={{ user, token, loading, roleName, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
