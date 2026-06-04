import React, { createContext, useContext, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  role: string;
  unitId: string;
  unitName?: string;
  clinicId: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  unitId: string | null; // 🔥 used across app
  login: (data: { token: string; staff: AuthUser }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  unitId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // restore session on refresh
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("auth_token");
  });

  const login = (data: { token: string; staff: AuthUser }) => {
    setUser(data.staff);
    setToken(data.token);

    localStorage.setItem("auth_user", JSON.stringify(data.staff));
    localStorage.setItem("auth_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        unitId: user?.unitId ?? null, // 🔥 replaces getAuthUnitId()
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
