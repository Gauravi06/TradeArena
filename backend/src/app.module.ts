import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { StocksModule } from './stocks/stocks.module';
import { TradesModule } from './trades/trades.module';

@Module({
  imports: [AuthModule, StocksModule, TradesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}