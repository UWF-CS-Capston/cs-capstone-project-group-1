/**
 * ⚙️ DEVELOPER CONFIGURATION TEMPLATE
 * 
 * Copy this section and paste it into GymBuddy/src/config/network.config.ts
 * to quickly update your network settings.
 * 
 * STEP 1: Find your IP address
 * --------------------------------
 * Windows:  ipconfig          → Look for "IPv4 Address"
 * Mac:      ifconfig          → Look for "inet" under active adapter
 * Linux:    ip addr           → Look for "inet" under active adapter
 * 
 * STEP 2: Update the values below
 * --------------------------------
 */

const DATABASE_HOST =
  process.env.PGHOST ||
  process.env.DATABASE_HOST ||
  'localhost';

export const NetworkConfig = {
  // TODO: Update with YOUR computer's IP address
  COMPUTER_IP: 'YOUR_IP_HERE',
  
  // TODO: Update with YOUR phone's IP address (if using physical device)
  PHONE_IP: 'YOUR_PHONE_IP_HERE',
  
  /**
   * 🔥 IMPORTANT PORT CONFIGURATION
   * --------------------------------
   * Backend API runs on 5001
   * PostgreSQL runs on 5000
   * 
   * DO NOT set both to the same port
   */
  
  // Backend API Server Port
  API_PORT: 5001,
  
  // Expo Dev Server Port
  EXPO_DEV_PORT: 8081,

  // Allowed origins for frontend ↔ backend communication
  CORS_ORIGINS: [
    'http://localhost:8081',
    'http://localhost:19006',
    'http://YOUR_IP_HERE:8081',
    'http://YOUR_IP_HERE:19006',
  ],

  /**
   * ⚠️ DATABASE CONFIG
   * --------------------------------
   * Values here are FALLBACKS only.
   * The backend primarily uses values from .env
   */
  DATABASE: {
    HOST: DATABASE_HOST,
    PORT: 5000, // PostgreSQL port
    USER: 'postgres',
    PASSWORD: 'postgres', // ⚠️ Only for fallback / dev use
    DATABASE: 'gymbuddy',
  },
} as const;

/**
 * Derived configuration used internally by the backend
 */
export const DerivedConfig = {
  CORS_ORIGINS: NetworkConfig.CORS_ORIGINS,
} as const;