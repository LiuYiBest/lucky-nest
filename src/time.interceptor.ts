import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimeInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    
    this.logger.debug(`开始处理请求: ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logger.debug(
            `请求处理完成: ${method} ${url} - 耗时: ${duration}ms`,
            {
              method,
              url,
              duration,
              timestamp: new Date().toISOString(),
            }
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logger.error(
            `请求处理失败: ${method} ${url} - 耗时: ${duration}ms`,
            {
              method,
              url,
              duration,
              error: error.message,
              stack: error.stack,
              timestamp: new Date().toISOString(),
            }
          );
        },
      }),
    );
  }
}
