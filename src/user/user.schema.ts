import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsEmail, IsString, MinLength } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  @IsString()
  username: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
