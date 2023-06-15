import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '@/config';
import { WorkerService } from '@/core/worker/service';
import { WorkerModule } from '@/core/worker/module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    WorkerModule,
  ],

  providers: [WorkerService],
  exports: [WorkerService],
})
export class CoreModule {}
