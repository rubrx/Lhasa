import { PrismaClient } from '../../../generated/prisma';
import { env } from '../../config/env';

// Prevent multiple PrismaClient instances during hot-reload in dev.
// In production NODE_ENV is always 'production' so the global is never set.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
