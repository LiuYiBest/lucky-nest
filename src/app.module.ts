import { Module, Global } from '@nestjs/common';
// import { UserModule } from './user/user.module';
// import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from './person/person.module';
import { OtherModule } from './other/other.module';
// import { Person } from './person/entities/person.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { createClient } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { Logger } from 'winston';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { MailModule } from './common/mail/templates/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/user.schema';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
      options: {
        password: 'root',
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'typeorm_test',
      // synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
    }),
    JwtModule.registerAsync({
      async useFactory() {
        await 111;
        return {
          secret: 'guang',
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-roll',
              options: {
                file: `log/app.log`,
                frequency: 'daily',
                level: 'info',
                maxSize: '20m',
                maxFiles: '14d',
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
    PersonModule,
    OtherModule,
    UserModule,
    ConfigModule,
    LogsModule,
    MailModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        client.on('error', (err) => console.error('Redis Client Error', err));
        client.on('connect', () => console.log('Redis Client Connected'));

        await client.connect();
        return client;
      },
    },
    AuthService,
  ],
})
export class AppModule {}
