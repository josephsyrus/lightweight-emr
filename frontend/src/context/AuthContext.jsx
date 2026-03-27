import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Remember to npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("emr_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem("emr_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("emr_token", token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem("emr_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
