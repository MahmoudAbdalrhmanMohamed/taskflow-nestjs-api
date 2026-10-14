import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

async function bootstrap() {
  const logger = new Logger('TaskFlowBootstrap');
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 TaskFlow Backend is running on: http://localhost:${port}`);
  logger.log(`📖 Swagger Documentation: http://localhost:${port}/api/docs`);
  logger.log(`💚 Health Check: http://localhost:${port}/health`);
  logger.log(`=======================================================`);
}

bootstrap();
