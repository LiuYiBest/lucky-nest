import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('数据库连接成功');

      // 监听Prisma事件
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
      });

      this.$on('info', (e) => {
        this.logger.log(`Info: ${e.message}`);
      });

      this.$on('warn', (e) => {
        this.logger.warn(`Warning: ${e.message}`);
      });

      this.$on('error', (e) => {
        this.logger.error(`Error: ${e.message}`);
      });
    } catch (error) {
      this.logger.error('数据库连接失败', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('数据库连接已关闭');
    } catch (error) {
      this.logger.error('关闭数据库连接失败', error.stack);
      throw error;
    }
  }
}
