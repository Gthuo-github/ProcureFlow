'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe, logoutUser, getTokens } from '@/lib/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'customer' | 'supplier';
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { access } = getTokens();
    if (!access) { setLoading(false); return; }
    try {
      const me = await getMe();
      setUser(me as User);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, loading, logout, refresh: load }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
