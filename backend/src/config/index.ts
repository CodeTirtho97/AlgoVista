import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiration: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  corsOrigin: string | RegExp;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algovista',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per 15 minutes
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Validate required configuration
function validateConfig(config: Config): void {
  const requiredEnvVars = ['mongodbUri', 'jwtSecret'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !config[envVar as keyof Config]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
  
  // Additional validation
  if (config.nodeEnv === 'production' && config.jwtSecret === 'default_jwt_secret_change_in_production') {
    throw new Error('Default JWT secret cannot be used in production');
  }
}

// Only validate in production to allow easier development
if (config.nodeEnv === 'production') {
  validateConfig(config);
}

export default config;