// src/utils/storage.ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Web storage fallback
const webStorage = {
  getItem: async (key: string) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (error) {
      console.error('Web storage get error:', error);
      return Promise.resolve(null);
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.error('Web storage set error:', error);
      return Promise.resolve();
    }
  },
  removeItem: async (key: string) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.error('Web storage remove error:', error);
      return Promise.resolve();
    }
  }
};

// Native storage using Expo SecureStore
const nativeStorage = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore set error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore remove error:', error);
    }
  }
};

// Use SecureStore on native, localStorage on web
const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

export default storage;