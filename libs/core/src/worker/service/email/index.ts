import { Injectable } from '@nestjs/common';
import { QueueTasks } from '@/core/utils/enums';
import { WorkerNamespace } from '@/core/utils/namespaces/worker/worker';
import { WorkerService } from '@/core/worker/service';
import { EmailWorkerEvent } from '@/core/utils/events/email';

@Injectable()
export class EmailService {
  constructor(private readonly worker: WorkerService) {}

  async send(options: WorkerNamespace.EmailOptions) {
    const event = new EmailWorkerEvent();
    event.mailOptions = { content: options.content, subject: options.subject };
    event.sender = options.from;
    event.recipient = options.to;
    event.attachments = options.attachments;
    event.bcc = options.bcc;
    event.cc = options.cc;
    this.worker.addEventToQueue(QueueTasks.SEND_EMAIL, event);
  }
}
