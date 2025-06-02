import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AaaException } from './person/AaaException';

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  private readonly logger = new Logger(AaaFilter.name);

  // 捕获异常
  catch(exception: AaaException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 500;

    this.logger.error(
      `异常处理: ${exception.message}`,
      {
        exception: {
          name: exception.name,
          message: exception.message,
          stack: exception.stack,
          aaa: exception.aaa,
          bbb: exception.bbb,
        },
        request: {
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: request.body,
        },
        timestamp: new Date().toISOString(),
      }
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      error: {
        aaa: exception.aaa,
        bbb: exception.bbb,
      },
    });

    // 如果是websocket
    if (host.getType() === 'ws') {
    } else if (host.getType() === 'rpc') {
    }
  }
}
