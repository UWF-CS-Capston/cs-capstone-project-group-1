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

export const NetworkConfig = {
  // TODO: Update with YOUR computer's IP address
  COMPUTER_IP: '192.168.1.182',
  
  // TODO: Update with YOUR phone's IP address (if using physical device)
  PHONE_IP: '192.168.1.162',
  
  // Backend API Server Port (default: 5000)
  API_PORT: 5000,
  
  // Expo Dev Server Port (default: 8081)
  EXPO_DEV_PORT: 8081,
  
  // PostgreSQL Database Configuration
  DATABASE: {
    HOST: '192.168.1.182',      // TODO: Update if database is on different machine
    PORT: 5432,
    USER: 'postgres',
    PASSWORD: 'postgres',       // ⚠️  Change in production!
    DATABASE: 'gymbuddy',
  },
} as const;
