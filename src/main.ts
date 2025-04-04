// Copyright (c) 2022 toimc<admin@wayearn.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { Request, Response, NextFunction } from 'express'; // import { LoginGuard } from 'src/login.guard';
// import { TestFilter } from 'src/test.filter';
// import { ValidatePipe } from 'src/validate.pipe';
// import { Session } from 'express-session';
// import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as session from 'express-session';

import { MyLogger } from 'src/MyLogger';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // 设置全局日志
  app.useLogger(new MyLogger());
  // 设置session
  app.use(
    session({
      secret: 'guang',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // const app = await NestFactory.create(AppModule, new FastifyAdapter());
  // 设置全局中间件
  app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log('before', req.url);
    next();
    console.log('after');
  });
  // // 设置全局守卫
  // app.useGlobalGuards(new LoginGuard());
  // // 设置全局过滤器
  // app.useGlobalFilters(new TestFilter());
  // // 设置全局管道
  // app.useGlobalPipes(new ValidatePipe());
  // 设置全局前缀
  app.setGlobalPrefix('api');
  // 设置静态文件
  app.useStaticAssets('public', { prefix: '/static' });
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
