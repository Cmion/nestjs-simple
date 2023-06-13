import { Module } from '@nestjs/common';
import { JobController } from '../controller';
import { AppService } from '../service';
import { ConfigModule } from '@nestjs/config';
import config from '@/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [JobController],
  providers: [AppService],
})
export class JobModule {}
