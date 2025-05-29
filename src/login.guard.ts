import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
  private readonly logger = new Logger(LoginGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('未提供认证令牌');
      throw new UnauthorizedException('请先登录');
    }

    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
      this.logger.debug(`用户 ${payload.sub} 认证成功`);
      return true;
    } catch (error) {
      this.logger.error(`认证失败: ${error.message}`, error.stack);
      throw new UnauthorizedException('认证令牌无效或已过期');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
