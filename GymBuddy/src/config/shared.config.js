/**
 * Shared Configuration - Used by both Metro and TypeScript code
 * This is the SINGLE SOURCE OF TRUTH for all network/port configuration
 */

const COMPUTER_IP = 'xxx.xxx.xxx.xxx'; // TODO: Update with YOUR computer's IP address
const PHONE_IP = 'xxx.xxx.xxx.xxx'; // TODO: Update with YOUR phone's IP address (if using physical device)
const API_PORT = 5001;
const DATABASE_PORT = 5000;
const EXPO_DEV_PORT = 8081;
const WEB_PORT = 19006;

module.exports = {
  COMPUTER_IP,
  PHONE_IP,
  API_PORT,
  DATABASE_PORT,
  EXPO_DEV_PORT,
  WEB_PORT,
};
