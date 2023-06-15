import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(ticker: string) {
    return ticker;
  }
  async getHistory() {
    return [];
  }
  async getStats() {
    return [];
  }
}
