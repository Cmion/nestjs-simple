import process from 'process';

export default () => ({
  api: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.PORT, 10) || 3112,
    environment: process.env.NODE_ENV ?? 'development',
    version: parseInt(process.env.APP_VERSION, 10) || 1,
    // Expiration in seconds
    jwtExpiration: process.env.JWT_EXPIRATION || 60 ** 60 * 72,
  },
  encryption: {
    salt: parseInt(process.env.ENCRYPTION_SALT, 10) || 12,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
    },
  },
  workers: {
    rabbitmq: {
      uri: process.env.RMQ_URI,
    },
    stock: {
      port: parseInt(process.env.STOCK_WORKER_PORT, 10) || 3113,
    },
  },
});
