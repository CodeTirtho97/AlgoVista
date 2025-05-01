import express, { Application, Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import config from './config';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

export default class App {
  public app: Application;
  public httpServer: http.Server;
  public io: SocketIOServer;
  private apolloServer: ApolloServer;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: config.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true
      }
    });
    
    this.configureMiddleware();
    this.setupApolloServer();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupSocketIO();
  }

  private async setupApolloServer(): Promise<void> {
    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        // Extract JWT from request and include in context
        const token = req.headers.authorization || '';
        return { token };
      },
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
      introspection: config.nodeEnv !== 'production'
    });

    await this.apolloServer.start();
    this.apolloServer.applyMiddleware({ app: this.app, path: '/graphql' });
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: config.nodeEnv === 'production' ? undefined : false
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: config.corsOrigin,
      credentials: true
    }));
    
    // Request parsing
    this.app.use(express.json({ limit: '1mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    
    // Compression for responses
    this.app.use(compression());
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use(limiter);
  }

  private setupRoutes(): void {
    // Health check route
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime(),
        dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      });
    });

    // Mount API routes
    this.app.use('/api/v1', routes);
  }

  private setupErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  private setupSocketIO(): void {
    this.io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      // Handle algorithm execution events
      socket.on('start-algorithm', (data) => {
        // Process algorithm data
        console.log(`Algorithm started: ${data.algorithmId}`);
      });
      
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
}