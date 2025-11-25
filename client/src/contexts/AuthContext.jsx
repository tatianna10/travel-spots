import { createContext, useState } from "react";
import { loginAPI, registerAPI, logoutAPI } from "../api/authAPI";

export const AuthContext = createContext();

const USER_KEY = "travelspots-user";

export function AuthProvider({ children }) {
  // Load logged-in user from localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Save user to both React state and localStorage
  function saveUser(apiUser) {
    // Extract ONLY the fields we use (clean & safe)
    const cleanUser = {
      email: apiUser.email,
      id: apiUser.id,               // your backend uses "id"
      accessToken: apiUser.accessToken,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(cleanUser));
    setUser(cleanUser);
  }

  // LOGIN
  async function login(credentials) {
    const result = await loginAPI(credentials);
    saveUser(result);
    return result;
  }

  // REGISTER
  async function register(credentials) {
    const result = await registerAPI(credentials);
    saveUser(result);
    return result;
  }

  // LOGOUT
  async function logout() {
    try {
      if (user?.accessToken) {
        await logoutAPI(user.accessToken);
      }
    } catch (err) {
      console.warn("Logout API failed:", err.message);
      // We still log out locally!
    }

    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const value = {
    user,                      // { email, id, accessToken }
    isAuthenticated: !!user,   // boolean
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
