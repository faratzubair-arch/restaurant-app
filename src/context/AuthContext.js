// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { mockUsers } from '../data/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usersList, setUsersList] = useState(mockUsers);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const foundUser = usersList.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return { success: true, role: foundUser.role };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (name, email, password, role) => {
    // Check karein ke email pehle se registered toh nahi
    const existingUser = usersList.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, message: 'Email already registered!' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role, // 'customer' ya 'manager'
    };

    setUsersList([...usersList, newUser]);
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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