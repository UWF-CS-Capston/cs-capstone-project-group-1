/**
 * Network Configuration for GymBuddy
 * This imports from the shared config which is the SINGLE SOURCE OF TRUTH
 */

// Import shared config (CommonJS)
const sharedConfig = require('./shared.config.js');

const DATABASE_HOST =
  process.env.PGHOST ||
  process.env.DATABASE_HOST ||
  'localhost';

export const NetworkConfig = {
  // All values are imported from shared.config.js - the single source of truth
  COMPUTER_IP: sharedConfig.COMPUTER_IP,
  PHONE_IP: sharedConfig.PHONE_IP,
  API_PORT: sharedConfig.API_PORT,
  EXPO_DEV_PORT: sharedConfig.EXPO_DEV_PORT,

  CORS_ORIGINS: [
    'http://localhost:8081',
    'http://localhost:19006',
    `http://${sharedConfig.COMPUTER_IP}:${sharedConfig.EXPO_DEV_PORT}`,
    `http://${sharedConfig.COMPUTER_IP}:${sharedConfig.WEB_PORT}`,
  ],

  DATABASE: {
    HOST: DATABASE_HOST,
    PORT: sharedConfig.DATABASE_PORT,
    USER: 'postgres',
    PASSWORD: 'postgres',
    DATABASE: 'gymbuddy',
  },
} as const;

export const DerivedConfig = {
  CORS_ORIGINS: NetworkConfig.CORS_ORIGINS,
} as const;