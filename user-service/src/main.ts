import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MetricsMiddleware } from './common/metrics.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.getHttpAdapter().get('/metrics', (_req, res) => res.json({ service: 'user-service', requests: MetricsMiddleware.counts }));
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
