import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "schoolhub_token";
const ADMIN_TOKEN_KEY = "schoolhub_admin_token";
const ADMIN_USER_KEY = "schoolhub_admin_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [impersonatingAdmin, setImpersonatingAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem(ADMIN_USER_KEY);
    try {
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch (_error) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      setImpersonatingAdmin(null);
      setLoading(false);
      return;
    }

    apiRequest("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        setImpersonatingAdmin(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setImpersonatingAdmin(null);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setImpersonatingAdmin(null);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setImpersonatingAdmin(null);
    setUser(null);
  }

  async function accessAccount(userId) {
    const currentToken = localStorage.getItem(TOKEN_KEY);
    const existingAdminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const existingAdminUser = localStorage.getItem(ADMIN_USER_KEY);
    const data = await apiRequest(`/users/${userId}/access`, {
      method: "POST"
    });

    if (existingAdminToken && existingAdminUser) {
      try {
        setImpersonatingAdmin(JSON.parse(existingAdminUser));
      } catch (_error) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.setItem(ADMIN_TOKEN_KEY, currentToken);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
        setImpersonatingAdmin(data.admin);
      }
    } else if (currentToken) {
      const adminUser = JSON.stringify(data.admin);
      localStorage.setItem(ADMIN_TOKEN_KEY, currentToken);
      localStorage.setItem(ADMIN_USER_KEY, adminUser);
      setImpersonatingAdmin(data.admin);
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  }

  function returnToAdmin() {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    const adminUser = localStorage.getItem(ADMIN_USER_KEY);

    if (!adminToken || !adminUser) {
      logout();
      return null;
    }

    let parsedAdmin;

    try {
      parsedAdmin = JSON.parse(adminUser);
    } catch (_error) {
      logout();
      return null;
    }
    localStorage.setItem(TOKEN_KEY, adminToken);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setImpersonatingAdmin(null);
    setUser(parsedAdmin);
    return parsedAdmin;
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isImpersonating: Boolean(impersonatingAdmin),
      impersonatingAdmin,
      login,
      register,
      logout,
      accessAccount,
      returnToAdmin
    }),
    [impersonatingAdmin, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
