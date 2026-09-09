
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import {
  setToken,
  setUser,
  clearToken,
  clearUser,
} from "@/store/user";

const TOKEN_KEY = "access_token";

const API_URL = "https://fmd-6pes.onrender.com";
// const API_URL = "http://192.168.30.88:8000";

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

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken =
          await SecureStore.getItemAsync(TOKEN_KEY);

        // No token means user is not authenticated
        if (!storedToken) {
          setIsAuthenticated(false);
          return;
        }

        // Restore token to Redux
        dispatch(setToken(storedToken));

        try {
          const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              Accept: "application/json",
            },
          });

          if (response.ok) {
            // API is available and token is accepted
            const profile = await response.json();

            dispatch(setUser(profile));
          } else {
            // API returned an error.
            // DO NOT delete the token.
            console.log(
              `Auth API returned status: ${response.status}`
            );
          }
        } catch (error) {
          // Network/API unavailable.
          // DO NOT delete the token.
          console.log(
            "Unable to connect to API. Keeping stored token.",
            error
          );
        }

        // Token exists, so keep the user authenticated
        setIsAuthenticated(true);
      } catch (error) {
        // SecureStore itself failed.
        // We still don't explicitly delete the token.
        console.error("Auth check failed:", error);

        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      // Token is deleted ONLY here
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      // Clear Redux state
      dispatch(clearToken());
      dispatch(clearUser());

      // Update authentication state
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

