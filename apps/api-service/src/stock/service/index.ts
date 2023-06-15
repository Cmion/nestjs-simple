import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma';
import { StockWorkerEvent } from '@/core/utils/events/stock';
import { QueueTasks } from '@/core/utils/enums';
import { WorkerService } from '@/core/worker/service';

@Injectable()
export class StockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly worker: WorkerService,
  ) {}

  async findOne(ticker: string, userId: string) {
    const event = new StockWorkerEvent();
    event.ticker = ticker;
    // console.log(event, userId);
    // return ticker;
    const stock = await this.worker.sendMessageToQueue(
      QueueTasks.GET_STOCK,
      event,
    );

    // The stock API does not throw exceptions
    /**
     * It returns this format when the stock ticker is invalid
     * ```json
     * {
     *     "symbols": [
     *         {
     *             "symbol": "AAPL.USD"
     *         }
     *     ]
     * }
     * ```
     * */
    if (!stock || !stock.name) {
      throw new BadRequestException('Invalid stock ticker');
    }

    await this.prisma.userStockHistory.create({
      data: {
        user_id: userId,
        name: stock.name,
        symbol: stock.symbol,
        high: stock.high,
        low: stock.low,
        open: stock.open,
        close: stock.close,
        volume: stock.volume,
        date: new Date(`${stock.date}T${stock.time}`),
      },
    });

    return stock;
  }

  async getStats() {
    const pipeline = [
      {
        $group: {
          // Group and sum up the stats (based on the count of the name)
          _id: '$name',
          times_requested: { $sum: 1 },
        },
      },
      {
        $match: {
          times_requested: { $gt: 0 }, // Could be changed to 1, so it filters out those stocks requested only once.
        },
      },
      {
        $sort: {
          times_requested: -1,
        },
      },
      {
        // Get the first 5
        $limit: 5,
      },
      {
        $project: {
          stock: '$_id',
          times_requested: 1,
          _id: 0,
        },
      },
    ];
    // console.log(aggregations);
    return this.prisma.userStockHistory.aggregateRaw({
      pipeline,
    });
  }
  async getHistory(userId: string) {
    return this.prisma.userStockHistory.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
