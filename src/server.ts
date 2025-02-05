import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase, checkDatabaseHealth } from './config/database';
import apiRoutes from './routes/api.route';
import './module-alias-setup';

const createApp = (): Express => {
  const app = express();

  // Security middlewares
  app.use(helmet());
  app.use(cors());

  // Request parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', async (_req: Request, res: Response) => {
    const dbHealthy = await checkDatabaseHealth();

    res.status(dbHealthy ? 200 : 503).json({
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
      },
    });
  });

  // // API routes
  app.use('/api', apiRoutes);

  return app;
};

const startServer = async (app: Express) => {
  const port = Number(env.PORT || 3000);

  try {
    await connectDatabase();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle termination
const setupGracefulShutdown = () => {
  process.on('SIGTERM', async () => {
    await disconnectDatabase();
    process.exit(0);
  });

  process.on('uncaughtException', (error) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
};

// Create the app instance
const app = createApp();
setupGracefulShutdown();

// Start server if this file is run directly
if (require.main === module) {
  startServer(app);
}

// Export for testing
export { app, startServer };
