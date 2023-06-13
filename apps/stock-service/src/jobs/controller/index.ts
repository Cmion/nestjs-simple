import { Controller, Logger } from '@nestjs/common';
import { QueueTasks } from '@/core/utils/enums';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class JobController {
  // constructor(private readonly service: JobServ) {}

  @EventPattern(QueueTasks.PING)
  public async ping(payload: any) {
    Logger.log(`Ping : ${JSON.stringify(payload)}`);
  }
}
