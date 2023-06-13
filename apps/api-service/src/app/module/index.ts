import { Global, Module } from '@nestjs/common';
import { AppController } from '../controller';
import { AppService } from '../service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { PrismaService } from '../../../../../prisma/connect';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
