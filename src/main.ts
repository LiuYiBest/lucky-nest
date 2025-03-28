import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: {
  hot?: {
    accept(): void;
    dispose(callback: () => void | Promise<void>): void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(async () => await app.close());
  }
}
bootstrap();
