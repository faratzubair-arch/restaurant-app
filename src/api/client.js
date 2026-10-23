import AsyncStorage from '@react-native-async-storage/async-storage';

let authToken = null;

// Localtunnel URL ke sath /api add kiya hai
const BASE_URL = 'https://red-jars-sing.loca.lt/api';

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
      'Bypass-Tunnel-Reminder': 'true', // Localtunnel warning bypass karne ke liye zaroori
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
