import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

export const prismaMock: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

export const connectDatabase = jest.fn(async () => {
  // eslint-disable-next-line no-console
  console.info('Mock database connected');
});

export const disconnectDatabase = jest.fn(async () => {
  // eslint-disable-next-line no-console
  console.info('Mock database disconnected');
});

export const checkDatabaseHealth = jest.fn(async () => true);

export { prismaMock as prisma };
