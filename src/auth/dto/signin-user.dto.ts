import { IsEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class SigninUserDto {
  @IsString()
  @IsEmpty()
  @Length(8, 20, {
    message: '用户名长度必须在8到20个字符之间',
  })
  username: string;

  @IsString()
  @IsEmpty()
  @Length(8, 20, {
    message: '密码长度必须在8到20个字符之间',
  })
  @Transform(({ value }) => {
    // 这里可以添加密码加密逻辑
    // 例如使用 bcrypt 加密
    // return bcrypt.hashSync(value, 10);
    return value;
  })
  password: string;
}
