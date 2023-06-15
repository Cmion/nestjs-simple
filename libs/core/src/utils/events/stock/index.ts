import { BaseWorkerEvent } from '@/core/utils/events';
import { WorkerQueue } from '@/core/utils/enums';

export class StockWorkerEvent extends BaseWorkerEvent {
  data: string;
  constructor() {
    super(WorkerQueue.WORK, {});
  }

  set ticker(value: string) {
    this.data = value;
  }
}
