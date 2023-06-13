import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';
import { WorkerQueue } from '@/core/utils/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const config = app.get(ConfigService);

  app.setGlobalPrefix(`v${config.get('api.version')}`);

  app.use(morgan('tiny'))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.get('workers.rabbitmq.uri')],
      queue: WorkerQueue.WORK,
      queueOptions: { durable: true },
      noAck: true,
    },
  });

  await app.listen(config.get<number>('workers.stock.port'));
  await app.startAllMicroservices();
}
bootstrap();
