// src/utils/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';


// Your computer's IP address
const COMPUTER_IP = '192.168.1.182';
const PORT = '5000';

// For physical Android device
export const API_BASE_URL = `http://${COMPUTER_IP}:${PORT}`;

// Add timeout and better error handling
// In utils/api.ts - add response intercepting
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('📡 Attempting to fetch:', url);
  console.log('📱 Platform:', Platform.OS);
  console.log('📲 Device info:', Constants.deviceName);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    console.log('✅ Response status:', response.status);
    
    // If unauthorized, you could trigger a logout event here
    if (response.status === 401) {
      console.log('🔒 Unauthorized - token may be expired');
      // You could emit an event that your app listens to for logout
    }
    
    return response;
  } catch (error) {
    console.log('❌ Fetch error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};