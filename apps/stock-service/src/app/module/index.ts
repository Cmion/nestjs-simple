import { Module } from '@nestjs/common';
import { WorkerController } from '../controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from '../../jobs/module';
import config from '@/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TerminusModule,
    JobModule,
  ],
  controllers: [WorkerController],
})
export class AppModule {}
