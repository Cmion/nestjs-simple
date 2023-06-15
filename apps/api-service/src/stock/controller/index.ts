import {
  Controller,
  Get,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { StockService } from '../service';
import { JwtAuthGuard } from '@/core/utils/guards';
import { RolesGuard } from '@/core/utils/guards/role';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller()
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private service: StockService) {}

  @Get('stock')
  @ApiBearerAuth()
  async findOne(@Query('q') ticker: string, @Req() request: Request) {
    return await this.service.findOne(
      ticker,
      (request.user as any).id as string,
    );
  }

  @Get('history')
  @ApiBearerAuth()
  async getHistory(@Req() request: Request) {
    return this.service.getHistory((request.user as any).id as string);
  }

  @Get('stats')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async getStats() {
    return this.service.getStats();
  }
}
