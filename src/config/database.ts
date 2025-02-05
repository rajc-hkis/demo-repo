/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { passwordHashExtension, softDeleteExtension } from './extensions';

const _prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

const prisma = _prisma.$extends(passwordHashExtension).$extends(softDeleteExtension);

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!isConnected) {
      await prisma.$connect();
      isConnected = true;
      console.info('Database connection established');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (isConnected) {
      await prisma.$disconnect();
      isConnected = false;
      console.info('Database disconnected successfully');
    }
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    throw error;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

export { prisma };
