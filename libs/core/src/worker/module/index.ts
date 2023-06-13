import { Logger, Module } from '@nestjs/common';
import { WorkerService } from '../service';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MicroserviceTokens, WorkerQueue } from '../../utils/enums';

const WORKER_PROVIDERS = [
  {
    provide: MicroserviceTokens.WORKER,
    useFactory: (config: ConfigService) => {
      Logger.log(`Rabbit MQ URL : ${config.get('workers.rabbitmq.uri')}`);
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [config.get('workers.rabbitmq.uri')],
          queue: WorkerQueue.WORK,
          queueOptions: { durable: true },
        },
      });
    },
    inject: [ConfigService],
  },
];

@Module({
  providers: [...WORKER_PROVIDERS, WorkerService],
  exports: [...WORKER_PROVIDERS, WorkerService],
})
export class WorkerModule {}
