import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { setToken, setUser, clearToken, clearUser } from "@/store/user";

const TOKEN_KEY = "access_token";

const API_URL = "https://fmd-6pes.onrender.com";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        dispatch(setToken(storedToken));

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          dispatch(setToken(null));
          setIsAuthenticated(false);
          return;
        }

        const profile = await response.json();
        dispatch(setUser(profile));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        dispatch(setToken(null));
        dispatch(setUser(null));
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    dispatch(clearToken());
    dispatch(clearUser());
    setIsAuthenticated(false);
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
