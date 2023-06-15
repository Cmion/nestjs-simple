import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import morgan from 'morgan';
import { PrismaService } from '@/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const config = app.get(ConfigService);

  // app.setGlobalPrefix(`v${config.get('api.version')}`);

  app.enableVersioning({
    defaultVersion: config.get('api.version'),
    type: VersioningType.URI,
  });

  app.use(morgan('tiny'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(config.get<number>('api.port'));
}
bootstrap();