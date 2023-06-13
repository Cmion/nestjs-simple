import { WorkerQueue } from '../../enums';
import { v4 as uuid } from 'uuid';

export class BaseWorkerEvent {
  public event: WorkerQueue;
  public id: string;
  public data: any;
  public external?: any;
  constructor(event: WorkerQueue, data: any) {
    this.event = event;
    this.data = data;
    this.id = `@@app:${event}:${uuid()}`;
  }
}
