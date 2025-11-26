import { createContext, useState } from "react";
import { loginAPI, registerAPI, logoutAPI } from "../api/authAPI";
import { getUserById } from "../api/userApi";

export const AuthContext = createContext();

const USER_KEY = "travelspots-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  function saveUser(apiUser) {
    const cleanUser = {
      id: apiUser.id,
      email: apiUser.email,
      fullName: apiUser.fullName ?? null,
      accessToken: apiUser.accessToken,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(cleanUser));
    setUser(cleanUser);
  }

  async function login(credentials) {
    const authData = await loginAPI(credentials);

    const profile = await getUserById(authData.id);

    saveUser({
      id: authData.id,
      email: authData.email,
      fullName: profile.fullName || authData.fullName || null,
      accessToken: authData.accessToken,
    });

    return authData;
  }

  async function register(credentials) {
    const authData = await registerAPI(credentials);

    const profile = await getUserById(authData.id);

    saveUser({
      id: authData.id,
      email: authData.email,
      fullName: profile.fullName || authData.fullName || null,
      accessToken: authData.accessToken,
    });

    return authData;
  }

  async function logout() {
    try {
      if (user?.accessToken) {
        await logoutAPI(user.accessToken);
      }
    } catch (err) {
      console.warn("Logout API failed:", err.message);
    }

    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
