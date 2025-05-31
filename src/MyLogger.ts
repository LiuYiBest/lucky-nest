import { ConsoleLogger, LoggerService, LogLevel } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export class MyLogger extends ConsoleLogger {
  private logger: Logger;

  constructor() {
    super();

    const logFormat = format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    );

    const consoleFormat = format.combine(
      format.colorize(),
      format.printf(({ context, level, message, timestamp, ...meta }) => {
        const appStr = chalk.green(`[NEST]`);
        const contextStr = chalk.yellow(`[${context}]`);
        const timestampStr = chalk.blue(`[${timestamp}]`);
        const levelStr = chalk.magenta(`[${level}]`);
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';

        return `${appStr} ${timestampStr} ${levelStr} ${contextStr} ${message} ${metaStr}`;
      })
    );

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(message, { context, timestamp });
  }

  error(message: string, context?: string, trace?: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.error(message, { context, timestamp, trace });
  }

  warn(message: string, context?: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(message, { context, timestamp });
  }

  debug(message: string, context?: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.debug(message, { context, timestamp });
  }

  verbose(message: string, context?: string) {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    this.logger.verbose(message, { context, timestamp });
  }
}
