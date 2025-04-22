import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

const validateRequest = (request: any): boolean => {
  // 这里可以添加验证逻辑，比如检查请求头、查询参数等
  // 例如，检查请求头中是否包含特定的认证信息
  return request.headers['authorization'] !== undefined;
};
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
