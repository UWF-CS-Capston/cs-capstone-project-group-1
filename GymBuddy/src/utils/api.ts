// src/utils/api.ts
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { NetworkConfig } from '../config/network.config';

export const API_BASE_URL =
  Platform.OS === 'web'
    ? `http://localhost:${NetworkConfig.API_PORT}`
    : `http://${NetworkConfig.COMPUTER_IP}:${NetworkConfig.API_PORT}`;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Attempting to fetch:', url);
  console.log('Platform:', Platform.OS);
  console.log('Device info:', Constants.deviceName);

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
    console.log('Response status:', response.status);

    if (response.status === 401) {
      console.log('Unauthorized - token may be expired');
    }

    return response;
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : {
            name: 'UnknownError',
            message: String(error),
            stack: undefined,
          };

    console.log('Fetch error details:', errorDetails);
    throw error;
  }
};