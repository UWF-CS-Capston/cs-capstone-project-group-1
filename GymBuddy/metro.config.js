const { getDefaultConfig } = require('expo/metro-config');
const { COMPUTER_IP, EXPO_DEV_PORT } = require('./src/config/shared.config.js');

const config = getDefaultConfig(__dirname);

// Override Metro server config to force static IP (no auto-detection)
config.server = {
  ...config.server,
  useWatchman: true,
};

// Set environment variable for Expo CLI
process.env.EXPO_PUBLIC_URL = `http://${COMPUTER_IP}:${EXPO_DEV_PORT}`;
process.env.LAN_IP = COMPUTER_IP;

// Also set this for Expo Go to read
config.projectRoot = __dirname;

module.exports = config;

