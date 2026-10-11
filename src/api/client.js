import AsyncStorage from '@react-native-async-storage/async-storage';

let authToken = null;

const BASE_URL = 'http://localhost:5000/api';

// Token set aur AsyncStorage mein save karne ke liye function
export const setAuthToken = async (token) => {
  authToken = token;
  if (token) {
    await AsyncStorage.setItem('authToken', token);
  } else {
    await AsyncStorage.removeItem('authToken');
  }
};

export const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      // Agar memory mein token nahi hai, toh AsyncStorage se utha lein
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