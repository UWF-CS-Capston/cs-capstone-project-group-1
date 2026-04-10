const DATABASE_HOST =
  process.env.PGHOST ||
  process.env.DATABASE_HOST ||
  "localhost";

export const NetworkConfig = {
  COMPUTER_IP: "172.19.80.1",
  PHONE_IP: "192.168.1.162",
  API_PORT: 5001,
  EXPO_DEV_PORT: 8081,

  CORS_ORIGINS: [
    "http://localhost:8081",
    "http://localhost:19006",
    "http://172.19.80.1:8081",
    "http://172.19.80.1:19006",
  ],

  DATABASE: {
    HOST: DATABASE_HOST,
    PORT: 5000,
    USER: "postgres",
    PASSWORD: "postgres",
    DATABASE: "gymbuddy",
  },
} as const;

export const DerivedConfig = {
  CORS_ORIGINS: NetworkConfig.CORS_ORIGINS,
} as const;