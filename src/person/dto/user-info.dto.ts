import { IsString, IsNumber, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class UserInfoDto {
  @IsString()
  name: string;
  @IsNumber()
  age: number;
  @IsBoolean()
  sex: boolean;
  @MinLength(6)
  @MaxLength(12)
  password: string;
}
