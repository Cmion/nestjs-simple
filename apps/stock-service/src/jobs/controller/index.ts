import { Controller, Logger } from '@nestjs/common';
import { QueueTasks } from '@/core/utils/enums';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { JobService } from '../service';
import { StockWorkerEvent } from '@/core/utils/events/stock';
import { EmailWorkerEvent } from '@/core/utils/events/email';
import { EmailWorkerService } from '../service/email/service';

@Controller()
export class JobController {
  constructor(
    private readonly service: JobService,
    private readonly emailService: EmailWorkerService,
  ) {}

  @EventPattern(QueueTasks.PING)
  public async ping(payload: any) {
    Logger.log(`Ping : ${JSON.stringify(payload)}`);
  }
  @MessagePattern(QueueTasks.GET_STOCK)
  public async getStock(options: StockWorkerEvent) {
    Logger.log(`Received Job:${QueueTasks.GET_STOCK} (${options.id})`);

    return await this.service.getStock(options.data);
  }

  @EventPattern(QueueTasks.SEND_EMAIL)
  public async sendEmail(options: EmailWorkerEvent) {
    Logger.log(`Received email Job:${QueueTasks.SEND_EMAIL}`);

    await this.emailService.send(options);
    const payload = {
      queueTask: QueueTasks.SEND_EMAIL,
      body: {
        jobId: options.id,
        subject: options.subject,
        receiver: Array.isArray(options.to)
          ? options.to.map((j) => j.email)
          : options.to.email,
      },
    };

    Logger.log(JSON.stringify(payload));
  }
}
