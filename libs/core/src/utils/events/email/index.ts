import { BaseWorkerEvent } from '../worker';
import { WorkerQueue } from '../../enums';
import { WorkerNamespace } from '../../namespaces/worker/worker';
import EmailOptions = WorkerNamespace.EmailOptions;

export class EmailWorkerEvent extends BaseWorkerEvent implements EmailOptions {
  from: { email: string; name?: string } = { email: '' };
  subject: string;
  content: string;
  to: { email: string; name?: string } = { email: '' };
  attachments?: any[];
  bcc?: string[] = [];
  cc?: string[] = [];

  constructor() {
    super(WorkerQueue.WORK, {});
  }

  set sender(options: { email: string; name?: string }) {
    this.from.email = options.email;
    this.from.name = options.name;
  }

  set recipient(options: { email: string; name?: string }) {
    this.to.email = options.email;
    this.to.name = options.name;
  }

  set mailOptions(options: Record<string, any>) {
    this.content = options.content;
    this.subject = options.subject;
  }
}
