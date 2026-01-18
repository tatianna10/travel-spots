import { createContext, useState } from 'react';
import { loginAPI, registerAPI } from '../api/authAPI';

export const AuthContext = createContext();

const USER_KEY = 'travelspots-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  function saveUser(apiUser) {
    const cleanUser = {
      _id: apiUser._id,
      email: apiUser.email,
      fullName: apiUser.fullName ?? null,
      accessToken: apiUser.accessToken,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(cleanUser));
    setUser(cleanUser);
  }

  async function login(credentials) {
    const authData = await loginAPI(credentials);
    saveUser(authData);
    return authData;
  }

  async function register(credentials) {
    const authData = await registerAPI(credentials);
    saveUser(authData);
    return authData;
  }

  function logout() {
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
