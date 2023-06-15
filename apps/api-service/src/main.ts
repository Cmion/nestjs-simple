import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import morgan from 'morgan';
import { PrismaService } from '@/prisma';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Main API Service')
    .setDescription('Jobsity node challenge')
    .setVersion(config.get('api.version'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<number>('api.port'));
}
bootstrap();
