import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const API_LOGIN = "http://127.0.0.1:8000/api/usuarios/login/";
  const API_REFRESH = "http://127.0.0.1:8000/api/usuarios/refresh/";

  // --- LOGIN ---
  const login = async (username: string, password: string) => {
    const res = await fetch(API_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const data = await res.json();

    await AsyncStorage.setItem("access", data.access);
    await AsyncStorage.setItem("refresh", data.refresh);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setUser(data.user);
  };

  // --- VALIDAR SESIÓN EXISTENTE ---
  const checkSession = async () => {
    try {
      const storedAccess = await AsyncStorage.getItem("access");
      const storedRefresh = await AsyncStorage.getItem("refresh");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedAccess && storedUser) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error validando sesión:", error);
    }
  };

  // --- REFRESH TOKEN AUTOMÁTICO ---
  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const res = await fetch(API_REFRESH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) throw new Error("Error al refrescar token");
      const data = await res.json();

      setAccessToken(data.access);
      await AsyncStorage.setItem("access", data.access);
    } catch (error) {
      console.error("Error actualizando token:", error);
      logout();
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    await AsyncStorage.multiRemove(["access", "refresh", "user"]);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  // --- CHEQUEO DE SESIÓN AL ABRIR LA APP ---
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
