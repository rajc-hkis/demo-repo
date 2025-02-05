import winston from 'winston';
import 'winston-daily-rotate-file';
import { env } from './env';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

// Define types for log levels
type LogLevel = keyof typeof levels;

interface LogMeta {
  timestamp?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: LogMeta;
}

const level = (): LogLevel => (env.NODE_ENV === 'development' ? 'debug' : 'info');

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.printf((info): string => {
    const logEntry: LogEntry = {
      timestamp: info.timestamp as string,
      level: info.level as LogLevel,
      message: info.message as string,
      metadata: info.metadata as LogMeta,
    };
    return JSON.stringify(logEntry);
  }),
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for the last 14 days
  level: 'info',
});

const transports = [new winston.transports.Console(), dailyRotateFileTransport];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export const log = {
  error: (message: string, meta?: LogMeta) => logger.error(message, meta),
  warn: (message: string, meta?: LogMeta) => logger.warn(message, meta),
  info: (message: string, meta?: LogMeta) => logger.info(message, meta),
  http: (message: string, meta?: LogMeta) => logger.http(message, meta),
  debug: (message: string, meta?: LogMeta) => logger.debug(message, meta),
};
