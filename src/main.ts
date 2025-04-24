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
  const configService = new ConfigService();
  const cors = configService.get('CORS', false);
  const prefix = configService.get('PREFIX', '/api');
  const versionStr = configService.get<string>('VERSION', '1.0');
  let version = [versionStr];
  if (versionStr.indexOf(',')) {
    version = versionStr.split(',');
  }
  if (cors === 'true') {
    app.enableCors();
  }
  app.setGlobalPrefix(prefix);
  // 设置全局版本, 默认版本为不设置
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: typeof versionStr === 'undefined' ? VERSION_NEUTRAL : version,
  });
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   cors: true,
  //   // logger: instance,
  // });

  // 设置全局日志
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // 设置session
  app.use(
    session({
      secret: 'guang',
      resave: false,
      saveUninitialized: false,
    }),
  );
  // 全局过滤器
  const errorFilter = app.get(WINSTON_MODULE_NEST_PROVIDER);
  if (errorFilter === 'true') {
    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(errorFilter, httpAdapterHost));
  }
  // const app = await NestFactory.create(AppModule, new FastifyAdapter());
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
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist去除多余属性
      whitelist: true,
      transform: true,
    }),
  );
  // 设置全局前缀
  app.setGlobalPrefix('api');
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
  await app.listen(3000);
}
bootstrap();
