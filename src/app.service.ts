import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class AppService implements OnModuleDestroy {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async getHello() {
    try {
      console.log('Fetching keys from Redis...');
      const value = await this.redisClient.keys('*');
      console.log('Redis keys:', value);

      // 添加测试数据
      await this.redisClient.set('test-key', 'test-value');
      const testValue = await this.redisClient.get('test-key');
      console.log('Test value:', testValue);

      return `Hello World! Redis test value: ${testValue}`;
    } catch (error) {
      console.error('Redis error:', error);
      throw error;
    }
  }
}
