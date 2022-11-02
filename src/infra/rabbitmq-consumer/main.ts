import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.startAllMicroservices();
  await app.listen(Number(process.env.RABBIT_CONSUMER_PORT));

  logger.log(
    `Order Service - RabbitMQ Consumer is listening on port ${process.env.RABBIT_CONSUMER_PORT}`,
    'Initialization',
  );
}
bootstrap();
