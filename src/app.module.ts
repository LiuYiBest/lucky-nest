import { Module, Global } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { OtherModule } from './other/other.module';
// import { Person } from './person/entities/person.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { Logger } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogsModule } from './common/logger/logs.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MailModule } from './common/mail/templates/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/user.schema';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development', '.env.production'],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL', 'redis://localhost:6379'),
        options: {
          password: configService.get('REDIS_PASSWORD', 'root'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/nest'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_DATABASE', 'typeorm_test'),
        logging: configService.get('DB_LOGGING', true),
        entities: [User],
        poolSize: configService.get('DB_POOL_SIZE', 10),
        connectorPackage: 'mysql2',
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport: {
            targets: [
              {
                target: 'pino-roll',
                options: {
                  file: configService.get('LOG_FILE', 'log/app.log'),
                  frequency: 'daily',
                  level: configService.get('LOG_LEVEL', 'info'),
                  maxSize: configService.get('LOG_MAX_SIZE', '20m'),
                  maxFiles: configService.get('LOG_MAX_FILES', '14d'),
                },
              },
              {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              },
            ],
          },
        },
      }),
      inject: [ConfigService],
    }),
    PersonModule,
    OtherModule,
    UserModule,
    LogsModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger, AuthService],
})
export class AppModule {}
