import { Controller, Post, Body, HttpException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authController: AuthService) {}
  @Post('/signin')
  async signIn(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    console.log('username', username, 'password', password);
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400);
    }
    // 用户名和密码不能为空
    if (username.length < 3 || password.length < 6) {
      throw new HttpException('用户名或密码长度不符合要求', 400);
    }

    // 处理登录逻辑
    return { message: 'Sign in successful' };
  }
  @Post('/signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    console.log('username', username, 'password', password);

    // 处理注册逻辑
    return { message: 'Sign up successful' };
  }
  @Post('/signout')
  async signOut() {
    // 处理登出逻辑
    return { message: 'Sign out successful' };
  }
}
