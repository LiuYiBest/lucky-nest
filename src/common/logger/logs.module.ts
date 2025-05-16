import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { consleTransport, createDailyRotateTransport } from './createDailyRotateTransport';
@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logOn = configService.get('LOG_ON') === 'true';
        return {
          transports: [consleTransport],
          ...(logOn
            ? [createDailyRotateTransport('info', 'application'), createDailyRotateTransport('warn', 'error')]
            : []),
        };
      },
    }),
  ],
})
export class LogsModule {}
