import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class WorkerController {
  constructor(
    private health: HealthCheckService,
    private service: MicroserviceHealthIndicator,
    private config: ConfigService,
  ) { }

  @Get('/ping')
  @HealthCheck()
  async checkService() {
    return await this.health.check([
      () =>
        Promise.resolve<HealthIndicatorResult>({
          worker: {
            app: `@@${this.config.get('api.name')}/stock/worker`,
            status: 'up',
            environment: this.config.get('api.environment'),
          },
        }),
    ]);
  }
}
