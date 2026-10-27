// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { setAuthToken } from '../api/client';

const AuthContext = createContext();

// Production Vercel Backend URL
const API_URL = 'https://restaurant-backend-neon-two.vercel.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authenticate existing user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setToken(data.token);
      await setAuthToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register new user account
  const signup = async (name, email, password, role) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: role || 'customer' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setUser(data);
      setToken(data.token);
      await setAuthToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear session state
  const logout = async () => {
    setUser(null);
    setToken(null);
    await setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, API_URL, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};