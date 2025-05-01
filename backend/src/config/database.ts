import mongoose from 'mongoose';
import config from './index';

// Configure Mongoose options
export const configureMongoose = (): void => {
  mongoose.set('strictQuery', true);
  
  // Log MongoDB queries in development
  if (config.nodeEnv === 'development') {
    mongoose.set('debug', true);
  }
};

// Create database connection
export const connectToDatabase = async (): Promise<void> => {
  try {
    configureMongoose();
    
    await mongoose.connect(config.mongodbUri);
    console.log('MongoDB connection established successfully');
    
    // Listen for connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Gracefully close database connection
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed successfully');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

export default {
  configureMongoose,
  connectToDatabase,
  closeDatabaseConnection
};