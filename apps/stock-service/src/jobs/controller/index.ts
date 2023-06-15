import { Controller, Logger } from '@nestjs/common';
import { QueueTasks } from '@/core/utils/enums';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { JobService } from '../service';
import { StockWorkerEvent } from '@/core/utils/events/stock';

@Controller()
export class JobController {
  constructor(private readonly service: JobService) {}

  @EventPattern(QueueTasks.PING)
  public async ping(payload: any) {
    Logger.log(`Ping : ${JSON.stringify(payload)}`);
  }
  @MessagePattern(QueueTasks.GET_STOCK)
  public async getStock(options: StockWorkerEvent) {
    Logger.log(`Received Job:${QueueTasks.GET_STOCK} (${options.id})`);

    return await this.service.getStock(options.data);
  }
}
