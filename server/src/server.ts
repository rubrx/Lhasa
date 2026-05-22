import './config/env'; // validate env first — crashes early if misconfigured
import app from './app';
import { env } from './config/env';
import { logger } from './services/lib/logger';
import prisma from './services/lib/prisma';

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received — draining connections');

  // Stop accepting new connections; wait for in-flight requests to finish
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  });

  // Force-exit if requests don't drain within 10 s
  // (Render's SIGKILL follows 10 s after SIGTERM)
  setTimeout(() => {
    logger.warn('Shutdown timeout — forcing exit');
    process.exit(1);
  }, 10_000).unref(); // .unref() so this timer doesn't keep the process alive on its own
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // Render sends this on deploy/scale-down
process.on('SIGINT',  () => shutdown('SIGINT'));  // Ctrl-C in local dev

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception — shutting down');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection — shutting down');
  process.exit(1);
});
