import React, {createContext, useContext, useEffect, useState} from "react";
import {
  fetchCurrentUser,
  getAccessToken,
  getUserPersist,
  loginByEmail,
  logoutUser,
  registerByEmail,
  type User as ApiUser,
} from "src/services/auth";

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => getUserPersist());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      const token = getAccessToken();
      if (token) {
        (async () => {
          try {
            setLoading(true);
            const me = await fetchCurrentUser();
            setUser(me);
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const me = await loginByEmail(email, password);
      setUser(me);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setError(null);
    setLoading(true);
    try {
      const me = await registerByEmail(email, password, fullName ?? "");
      setUser(me);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setUser(null);
    try {
      await logoutUser();
    } catch {
      // Ignore
    }
  };

  const reload = async () => {
    setLoading(true);
    try {
      const me = await fetchCurrentUser();
      setUser(me);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, error, login, register, logout, reload}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
}
