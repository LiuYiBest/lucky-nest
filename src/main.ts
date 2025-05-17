import { HttpAdapterHost } from '@nestjs/core';
// Copyright (c) 2022 toimc<admin@wayearn.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { Request, Response, NextFunction } from 'express'; // import { LoginGuard } from 'src/login.guard';
// import { TestFilter } from 'src/test.filter';
// import { ValidatePipe } from 'src/validate.pipe';
// import { Session } from 'express-session';
// import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as session from 'express-session';
// import * as winston from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import * as DailyRotateFile from 'winston-daily-rotate-file'; // 添加这行导入
// import { MyLogger } from 'src/MyLogger';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const instance = winston.createLogger({
  //   // options of Winston
  //   transports: [
  //     new winston.transports.Console({
  //       format: winston.format.combine(winston.format.timestamp(), winston.format.json(), utilities.format.nestLike()),
  //       level: 'debug',
  //     }),
  //     new DailyRotateFile({
  //       dirname: 'logs',
  //       filename: 'logs/app-%DATE%.log',
  //       datePattern: 'YYYY-MM-DD',
  //       level: 'debug',
  //       maxSize: '20m',
  //       maxFiles: '14d',
  //     }),
  //   ],
  // });
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 配置 CORS
  const cors = configService.get('CORS', false);
  if (cors === 'true') {
    app.enableCors();
  }

  // 配置 API 前缀
  const prefix = configService.get('PREFIX', '/api');
  app.setGlobalPrefix(prefix);

  // 配置 API 版本
  const versionStr = configService.get<string>('VERSION', '1.0');
  const version = versionStr.includes(',') ? versionStr.split(',') : [versionStr];
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: typeof versionStr === 'undefined' ? VERSION_NEUTRAL : version,
  });

  // 配置 Session
  app.use(
    session({
      secret: configService.get('SESSION_SECRET', 'your-secret-key'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get('NODE_ENV') === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // 配置全局异常过滤器
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapterHost));

  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 设置全局中间件
  app.use(function (req: Request, res: Response, next: NextFunction) {
    // console.log('before', req.url);
    next();
    // console.log('after');
  });
  // // 设置全局守卫
  // app.useGlobalGuards(new LoginGuard());
  // // 设置全局过滤器
  // app.useGlobalFilters(new TestFilter());
  // // 设置全局管道
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // whitelist去除多余属性
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );
  // 设置全局前缀
  // app.setGlobalPrefix('api');
  // 设置静态文件
  // app.useStaticAssets('public', { prefix: '/static' });
  // 设置session
  // app.use(
  //   Session({
  //     // 设置session密钥
  //     secret: 'session-secret',
  //     // 设置session是否每次请求都重新保存
  //     resave: false,
  //     // 设置session是否在未初始化时保存
  //     saveUninitialized: false,
  //     cookie: {
  //       // 设置session过期时间为30天
  //       maxAge: 1000 * 60 * 60 * 24 * 30,
  //     },
  //   }),
  // );
  // 启动应用
  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
