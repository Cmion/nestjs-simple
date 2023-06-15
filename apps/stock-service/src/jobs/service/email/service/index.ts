import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { WorkerNamespace } from '@/core/utils/namespaces/worker/worker';
import { isEmpty } from 'lodash';
import { CreateEmailOptions } from 'resend/build/src/emails/interfaces';

@Injectable()
export class EmailWorkerService {
  constructor(protected config: ConfigService) {}

  async send(options: WorkerNamespace.EmailOptions) {
    // throw new Error('Text');
    if (this.config.get('api.environment') === 'test') {
      return;
    }

    return await this.resend(options);
  }

  async resend(options: WorkerNamespace.EmailOptions) {
    const resend = new Resend(this.config.get('workers.email.resend.apiKey'));

    const payload: CreateEmailOptions = {
      from: options.from?.email ?? this.config.get('workers.email.noReply'),
      to: options.to.email,
      subject: options.subject || this.config.get('api.name'),
      html: options.content,
      bcc: options.bcc,
      cc: options.cc,
    };

    if (options.attachments && !isEmpty(options.attachments)) {
      payload.attachments = options.attachments;
    }
    resend.emails.send(payload);
  }
}
