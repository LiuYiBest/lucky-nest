import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;
import { ConfigModule as Config } from '@nestjs/config';

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  DB_PORT: Joi.number().default(3306),
  DB_URL: Joi.string().domain(),
  DB_HOST: Joi.string().ip(),
});

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: schema,
    }),
  ],
})
export class ConfigModule {}
