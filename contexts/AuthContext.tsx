"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { RegisterData, LoginData } from "@/types";
import { apiCall } from "@/services/api-config";

interface AuthContextType {
  token: string | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  requireAuth: (requestedPath: string) => boolean;
  getAndClearRedirect: () => string | null;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string, resetToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    // Récupération du token depuis le localStorage ou sessionStorage
    if (typeof window !== "undefined") {
      const persistentToken = localStorage.getItem("authToken");
      const sessionToken = sessionStorage.getItem("authToken");

      return persistentToken || sessionToken || null;
    }

    return null;
  });

  useEffect(() => {
    // Récupérer le token stocké au chargement
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Effet pour synchroniser le token
  useEffect(() => {
    if (token) {
      // Le token sera stocké dans localStorage ou sessionStorage selon le choix de l'utilisateur
      const lastStorageChoice = localStorage.getItem("rememberMe") === "true";

      if (lastStorageChoice) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
        localStorage.removeItem("authToken");
      }
    } else {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  }, [token]);

  const register = async (data: RegisterData) => {
    try {
      await apiCall("auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Si apiCall ne lance pas d'erreur, l'inscription est réussie
    } catch (err) {
      console.error("Error during registration:", err);
      throw err;
    }
  };

  const login = async (data: LoginData) => {
    try {
      const responseData = await apiCall("auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!responseData.accessToken) {
        console.error("Pas de token dans la réponse:", responseData);
        throw new Error("Token non reçu du serveur");
      }

      // Sauvegarde du choix de l'utilisateur pour "Se souvenir de moi"
      localStorage.setItem("rememberMe", String(!!data.rememberMe));

      // Sauvegarde du token selon le choix "Se souvenir de moi"
      if (data.rememberMe) {
        localStorage.setItem("token", responseData.accessToken);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", responseData.accessToken);
        localStorage.removeItem("token");
      }

      setToken(responseData.accessToken);
    } catch (err) {
      console.error("Error during login:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiCall("auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // Nettoyage complet du stockage
      setToken(null);
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  // Fonction pour rediriger vers la page de login en sauvegardant la page demandée
  const requireAuth = (requestedPath: string) => {
    if (!isAuthenticated()) {
      // Ne pas sauvegarder la page de login comme redirection
      if (requestedPath !== "/auth/login") {
        sessionStorage.setItem("redirectAfterLogin", requestedPath);
      }

      return false;
    }

    return true;
  };

  // Fonction pour obtenir et effacer la redirection sauvegardée
  const getAndClearRedirect = () => {
    const redirect = sessionStorage.getItem("redirectAfterLogin");

    if (redirect) {
      sessionStorage.removeItem("redirectAfterLogin");
      return redirect;
    }
    return null;
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await apiCall("auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // En cas de succès, l'API renvoie un message
    } catch (err) {
      console.error("Error requesting password reset:", err);
      throw err;
    }
  };

  const resetPassword = async (newPassword: string, resetToken: string) => {
    try {
      await apiCall("auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Reset-Token": resetToken,
        },
        body: JSON.stringify({ newPassword }),
      });
    } catch (err) {
      console.error("Error resetting password:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        register,
        login,
        logout,
        isAuthenticated,
        requireAuth,
        getAndClearRedirect,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
