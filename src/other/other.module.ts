import { Module, Global } from '@nestjs/common';
import { OtherService } from './other.service';

// 全局模块还是尽量少用，不然注入的很多 provider 都不知道来源，会降低代码的可维护性。
@Global()
@Module({
  providers: [OtherService],
  exports: [OtherService],
})
export class OtherModule {}
