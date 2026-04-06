/**
 * Network Configuration
 * 
 * This file contains all IP addresses and port numbers used in the GymBuddy app.
 * Developers should update these values before starting development.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Find your computer's local IP address:
 *    - Windows: Run `ipconfig` and look for IPv4 Address
 *    - macOS/Linux: Run `ifconfig` or `ip addr`
 * 2. Update COMPUTER_IP below with your IP address
 * 3. Update PHONE_IP if testing on a physical device
 */

export const NetworkConfig = {
  // Developer Machine IP Address
  // TODO: Update this with your computer's local IP address (e.g., from ipconfig/ifconfig)
  COMPUTER_IP: '192.168.1.68',
  
  // Phone/Mobile Device IP Address (if testing on physical device)
  // TODO: Update this with your phone's local IP address
  PHONE_IP: '192.168.1.162',
  
  // Backend API Server Port
  API_PORT: 5000,
  
  // Expo Dev Server Port
  EXPO_DEV_PORT: 8081,
  
  // PostgreSQL Database Configuration (for direct connections)
  DATABASE: {
    HOST: '192.168.1.182',
    PORT: 5432,
    USER: 'postgres',
    PASSWORD: 'postgres',
    DATABASE: 'gymbuddy',
  },
} as const;

// Derived Configuration (DO NOT EDIT)
export const DerivedConfig = {
  // API Base URL (automatically selects based on platform)
  get API_BASE_URL() {
    const { API_PORT, COMPUTER_IP } = NetworkConfig;
    
    // Check if running on web or native
    if (typeof window !== 'undefined' && window.location) {
      return `http://localhost:${API_PORT}`;
    }
    return `http://${COMPUTER_IP}:${API_PORT}`;
  },
  
  // CORS Origins for Express Server
  get CORS_ORIGINS() {
    const { COMPUTER_IP, PHONE_IP, EXPO_DEV_PORT } = NetworkConfig;
    return [
      `http://localhost:${EXPO_DEV_PORT}`,
      `http://${COMPUTER_IP}:${EXPO_DEV_PORT}`,
      `http://${PHONE_IP}:${EXPO_DEV_PORT}`,
    ];
  },
  
  // Database Connection String
  get DATABASE_URL() {
    const { HOST, PORT, USER, PASSWORD, DATABASE } = NetworkConfig.DATABASE;
    return `postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`;
  },
} as const;

export default NetworkConfig;
