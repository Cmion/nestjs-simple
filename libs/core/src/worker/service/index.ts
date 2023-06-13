import {
  Global,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceTokens, QueueTasks } from '../../utils/enums';
import { firstValueFrom } from 'rxjs';
import { BaseWorkerEvent } from '@/core/utils/events';

@Global()
@Injectable()
export class WorkerService {
  constructor(
    @Inject(MicroserviceTokens.WORKER)
    private readonly client: ClientProxy,
  ) {}

  async sendMessageToQueue(task: QueueTasks, job: BaseWorkerEvent) {
    Logger.log(`Event:${job.event} Task:${task}`);

    const response = await firstValueFrom(this.client.send(task, job));
    Logger.log(
      `Task completed: ${job.event}, Task:${task} in ${
        response?.duration ?? '0ms'
      }`,
    );
    return response;
  }
  public async addEventToQueue(
    task: QueueTasks,
    job: BaseWorkerEvent,
  ): Promise<any> {
    Logger.log(`Event:${job.event} Task:${task}`);

    this.client.emit(task, job).subscribe((res) => {
      Logger.log(
        `Task completed: ${job.event}, Task:${task} in ${
          res?.duration ?? '0ms'
        }`,
      );
      return (e) => {
        Logger.error(new InternalServerErrorException(e.message));
      };
    });
  }
}
