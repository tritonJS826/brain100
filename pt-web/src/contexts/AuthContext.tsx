import React, {createContext, useContext, useEffect, useState} from "react";
import {loginByEmail, logoutUser, registerByEmail} from "src/services/auth";

type UserOut = { id: number; email: string };

type AuthState = {
  user: UserOut | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    const rawId = localStorage.getItem("userId");
    const userId = rawId ? Number(rawId) : null;

    if (access && userId) {
      const storedEmail = localStorage.getItem("userEmail") || "";
      setUser({id: userId, email: storedEmail});
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      await loginByEmail(email, password);
      const rawId = localStorage.getItem("userId");
      const userId = rawId ? Number(rawId) : null;
      localStorage.setItem("userEmail", email);
      setUser(userId ? {id: userId, email} : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setError(null);
    setLoading(true);
    try {
      const fallbackName = localStorage.getItem("profileName") || undefined;
      const {user: newUser} = await registerByEmail(email, password, fullName ?? fallbackName ?? "");
      localStorage.setItem("userEmail", newUser.email || email);
      if (fullName) {
        localStorage.setItem("profileName", fullName);
      }
      setUser(newUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Register failed";
      setError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("userId");
    try {
      await logoutUser();
    } catch {
      // Ignore
    }
  };

  const reload = () => {
    const access = localStorage.getItem("accessToken");
    const rawId = localStorage.getItem("userId");
    const userId = rawId ? Number(rawId) : null;
    if (access && userId) {
      const storedEmail = localStorage.getItem("userEmail") || "";
      setUser({id: userId, email: storedEmail});
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, error, login, register, logout, reload}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
