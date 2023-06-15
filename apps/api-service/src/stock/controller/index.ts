import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { StockService } from '../service';
import { JwtAuthGuard } from '@/core/utils/guards';
import { RolesGuard } from '@/core/utils/guards/role';

@Controller()
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private service: StockService) {}

  @Get('stock')
  async findOne(@Query('q') ticker: string) {
    return await this.service.findOne(ticker);
  }

  @Get('history')
  async getHistory() {
    return await this.service.getHistory();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async getStats() {
    return await this.service.getStats();
  }
}
