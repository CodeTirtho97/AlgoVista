import App from './app';
import mongoose from 'mongoose';
import config from './config';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message, error.stack);
  process.exit(1);
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize the application
async function startServer() {
  await connectToDatabase();
  
  const application = new App();
  const PORT = config.port;
  
  const server = application.httpServer.listen(PORT, () => {
    console.log(`
🚀 Server ready at http://localhost:${PORT}
📱 Socket.IO ready for connections
🔒 Environment: ${config.nodeEnv}
    `);
  });
  
  // Handle unhandled rejections
  process.on('unhandledRejection', (error) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(error);
    
    server.close(() => {
      process.exit(1);
    });
  });
  
  // Handle SIGTERM signal
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated.');
    });
  });
}

startServer();