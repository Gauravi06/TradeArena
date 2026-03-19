import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { PrismaService } from '../prisma.service';
import { StocksService } from '../stocks/stocks.service';

@Module({
  controllers: [TradesController],
  providers: [TradesService, PrismaService, StocksService],
})
export class TradesModule {}