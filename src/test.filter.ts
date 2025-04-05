import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AaaException } from './person/AaaException';

@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  // 捕获异常
  catch(exception: AaaException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      // 获取http上下文
      const ctx = host.switchToHttp();
      // 获取响应
      const response = ctx.getResponse<Response>();
      // 获取请求
      const request = ctx.getRequest<Request>();
      // 设置响应状态码
      response.status(500).json({
        aaa: exception.aaa,
        bbb: exception.bbb,
      });
      // 如果是websocket
    } else if (host.getType() === 'ws') {
    } else if (host.getType() === 'rpc') {
    }
  }
}
