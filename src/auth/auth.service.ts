import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 这里可以注入其他服务，比如用户服务
  constructor(private jwtService: JwtService) {}
  async validateUser(username: string, password: string): Promise<any> {
    // 在这里实现用户验证逻辑
    return null;
  }

  async signin(user: string, password: string) {
    // 在这里实现登录逻辑
    if (!user || !password) {
      throw new Error('用户名或密码不能为空');
    }
    const payload = { username: user, sub: password };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(user: any) {
    // 在这里实现注册逻辑
    return { message: 'User registered successfully' };
  }
}
