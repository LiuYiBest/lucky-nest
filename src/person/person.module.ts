import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { LogMiddleware } from 'src/log.middleware';
// 全局守卫
// import { APP_GUARD } from '@nestjs/core';
// 登录守卫
// import { LoginGuard } from 'src/login.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  imports: [],
  controllers: [PersonController],
  providers: [
    PersonService,
    // {
    //   provide: APP_GUARD,
    //   useClass: LoginGuard,
    // },
  ],
})
export class PersonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 设置中间件, 只对 person 模块生效
    consumer.apply(LogMiddleware).forRoutes('person*');
  }
}
