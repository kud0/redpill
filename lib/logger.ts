/**
 * Simple logger utility with levels for production
 *
 * Log levels: error, warn, info, debug
 * In production, only error and warn are logged
 * In development, all levels are logged
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// In production, only log errors and warnings
const currentLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
}

function formatLog(entry: LogEntry): string {
  const prefix = entry.context ? `[${entry.context}]` : '';
  return `${entry.timestamp} ${entry.level.toUpperCase()} ${prefix} ${entry.message}`;
}

function createLogEntry(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
    context,
  };
}

export const logger = {
  error(message: string, data?: unknown, context?: string): void {
    if (shouldLog('error')) {
      const entry = createLogEntry('error', message, data, context);
      console.error(formatLog(entry), data ?? '');
    }
  },

  warn(message: string, data?: unknown, context?: string): void {
    if (shouldLog('warn')) {
      const entry = createLogEntry('warn', message, data, context);
      console.warn(formatLog(entry), data ?? '');
    }
  },

  info(message: string, data?: unknown, context?: string): void {
    if (shouldLog('info')) {
      const entry = createLogEntry('info', message, data, context);
      console.info(formatLog(entry), data ?? '');
    }
  },

  debug(message: string, data?: unknown, context?: string): void {
    if (shouldLog('debug')) {
      const entry = createLogEntry('debug', message, data, context);
      console.debug(formatLog(entry), data ?? '');
    }
  },

  // API-specific loggers
  api: {
    request(endpoint: string, wallet: string): void {
      logger.info(`API request: ${endpoint}`, { wallet: wallet.slice(0, 8) + '...' }, 'API');
    },

    success(endpoint: string, duration?: number): void {
      logger.info(`API success: ${endpoint}`, { durationMs: duration }, 'API');
    },

    error(endpoint: string, error: unknown): void {
      logger.error(`API error: ${endpoint}`, error, 'API');
    },
  },

  // AI provider loggers
  ai: {
    attempt(provider: string, model: string): void {
      logger.debug(`Attempting ${provider}`, { model }, 'AI');
    },

    success(provider: string, model: string): void {
      logger.info(`Success with ${provider}`, { model }, 'AI');
    },

    fallback(from: string, to: string, reason?: string): void {
      logger.warn(`Falling back from ${from} to ${to}`, { reason }, 'AI');
    },

    error(provider: string, error: unknown): void {
      logger.error(`Provider error: ${provider}`, error, 'AI');
    },
  },

  // Database loggers
  db: {
    query(operation: string, table: string): void {
      logger.debug(`DB ${operation}: ${table}`, undefined, 'DB');
    },

    error(operation: string, error: unknown): void {
      logger.error(`DB error: ${operation}`, error, 'DB');
    },
  },
};

export default logger;
