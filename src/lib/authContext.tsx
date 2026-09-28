import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  getSession,
  isProActive,
  login as authLogin,
  logout as authLogout,
  register as authRegister,
  setProActive,
  type AuthResult,
  type Session,
} from "./auth";

interface AuthContextValue {
  session: Session | null;
  isPro: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, name?: string) => Promise<AuthResult>;
  logout: () => void;
  activatePro: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [isPro, setIsPro] = useState<boolean>(() => isProActive());

  const login = useCallback(async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result.ok && result.session) setSession(result.session);
    return result;
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const result = await authRegister(email, password, name);
    if (result.ok && result.session) setSession(result.session);
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setSession(null);
  }, []);

  const activatePro = useCallback(() => {
    setProActive(true);
    setIsPro(true);
  }, []);

  const value = useMemo(
    () => ({ session, isPro, login, register, logout, activatePro }),
    [session, isPro, login, register, logout, activatePro]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von <AuthProvider> verwendet werden.");
  return ctx;
}
