/**
 * MuhsinAI Logging Utility
 * 
 * Provides configurable logging that can be disabled in production
 * and includes different log levels.
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LoggerConfig {
  level: LogLevel;
  enableInProduction: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig = {
    level: __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR,
    enableInProduction: false,
    prefix: '[MuhsinAI]'
  }) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    // Don't log in production unless explicitly enabled
    if (!__DEV__ && !this.config.enableInProduction) {
      return false;
    }
    
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, ...args: any[]): void {
    const prefix = this.config.prefix ? `${this.config.prefix} ` : '';
    const timestamp = new Date().toISOString();
    
    if (args.length > 0) {
      console.log(`${prefix}[${timestamp}] ${level}: ${message}`, ...args);
    } else {
      console.log(`${prefix}[${timestamp}] ${level}: ${message}`);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.formatMessage('ERROR', message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.formatMessage('WARN', message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('INFO', message, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.formatMessage('DEBUG', message, ...args);
    }
  }

  // Analytics specific logging
  analytics(event: string, properties?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('ANALYTICS', `Event: ${event}`, properties);
    }
  }

  // Authentication specific logging
  auth(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('AUTH', message, ...args);
    }
  }

  // Purchases specific logging
  purchases(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('PURCHASES', message, ...args);
    }
  }
}

// Export a default logger instance
export const logger = new Logger();

// Export specific loggers for different modules
export const analyticsLogger = new Logger({
  level: __DEV__ ? LogLevel.DEBUG : LogLevel.WARN,
  enableInProduction: false,
  prefix: '[Analytics]'
});

export const authLogger = new Logger({
  level: __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR,
  enableInProduction: false,
  prefix: '[Auth]'
});

export const purchasesLogger = new Logger({
  level: __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR,
  enableInProduction: false,
  prefix: '[Purchases]'
});

export default logger;