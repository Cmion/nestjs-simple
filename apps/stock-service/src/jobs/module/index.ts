import { Module } from '@nestjs/common';
import { JobController } from '../controller';
import { JobService } from '../service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { HttpModule } from '@nestjs/axios';
import { EmailWorkerService } from '../service/email/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    HttpModule,
  ],
  controllers: [JobController],
  providers: [JobService, EmailWorkerService],
})
export class JobModule {}
