import { Module } from '@nestjs/common';
import { StockController } from '../controller';
import { StockService } from '../service';

@Module({
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
