import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  getStocks() {
    return this.stocksService.getStocks();
  }

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string) {
    return this.stocksService.getPrice(symbol.toUpperCase());
  }

  @Get(':symbol/history')
  async getHistory(@Param('symbol') symbol: string, @Query('days') days: number = 7) {
  return this.stocksService.getHistoricalData(symbol.toUpperCase(), days);
}
}