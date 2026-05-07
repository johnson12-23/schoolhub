import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("schoolhub_token");

    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("schoolhub_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    localStorage.setItem("schoolhub_token", data.token);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("schoolhub_token", data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("schoolhub_token");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

