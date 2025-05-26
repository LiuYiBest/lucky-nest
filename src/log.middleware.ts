import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'];
    const startTime = Date.now();

    this.logger.debug(
      `收到请求: ${method} ${originalUrl}`,
      {
        method,
        url: originalUrl,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      }
    );

    // 记录响应
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      this.logger.debug(
        `请求完成: ${method} ${originalUrl} - ${statusCode}`,
        {
          method,
          url: originalUrl,
          statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString(),
        }
      );
    });

    next();
  }
}
