export enum WorkerQueue {
  WORK = 'worker.default',
}

export enum MicroserviceTokens {
  WORKER = 'WORKER_SERVICE_TOKEN',
}

export enum QueueTasks {
  PING = 'task.send.ping',
  GET_STOCK = 'task.get.stock.info',
  SEND_EMAIL = 'task.send.email',
}
