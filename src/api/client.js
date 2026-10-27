// src/api/client.js
import AsyncStorage from '@react-native-async-storage/async-storage';

let authToken = null;

// Production Vercel Backend URL
const BASE_URL = 'https://restaurant-backend-neon-two.vercel.app/api';

// Store and update authentication token in memory and persistent storage
export const setAuthToken = async (token) => {
  authToken = token;
  if (token) {
    await AsyncStorage.setItem('authToken', token);
  } else {
    await AsyncStorage.removeItem('authToken');
  }
};

// Centralized API request wrapper
export const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      // Retrieve token from AsyncStorage if not present in memory
      if (!authToken) {
        authToken = await AsyncStorage.getItem('authToken');
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};