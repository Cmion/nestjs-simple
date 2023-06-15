import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { get } from 'lodash';

@Injectable()
export class JobService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getStock(ticker: string) {
    const url = `${this.config.get(
      'externals.stock.url',
    )}/?s=${ticker}&f=sd2t2ohlcvn&h&e=json`;

    const stock = await lastValueFrom(await this.http.get(url));

    // console.log(stock.data)

    return get(stock.data, ['symbols', 0]);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
