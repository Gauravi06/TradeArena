import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StocksService } from '../stocks/stocks.service';

@Injectable()
export class TradesService {
  constructor(
    private prisma: PrismaService,
    private stocksService: StocksService,
  ) {}

  async buyStock(userId: string, symbol: string, quantity: number) {
    const { price } = await this.stocksService.getPrice(symbol);
    if (!price) throw new BadRequestException('Invalid stock symbol');

    const totalCost = price * quantity;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    if (user.cash < totalCost) throw new BadRequestException('Insufficient funds');

    // Make sure stock exists in DB first
    await this.prisma.stock.upsert({
      where: { symbol },
      update: { price },
      create: { symbol, name: symbol, price },
    });

    // Record the trade
    await this.prisma.trade.create({
      data: {
        type: 'buy',
        quantity,
        price,
        userId,
        stockSymbol: symbol,
      },
    });

    // Update or create holding
    const existing = await this.prisma.portfolioHolding.findUnique({
      where: { userId_stockSymbol: { userId, stockSymbol: symbol } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      const newAvg = (existing.avgBuyPrice * existing.quantity + price * quantity) / newQty;
      await this.prisma.portfolioHolding.update({
        where: { userId_stockSymbol: { userId, stockSymbol: symbol } },
        data: { quantity: newQty, avgBuyPrice: newAvg },
      });
    } else {
      await this.prisma.portfolioHolding.create({
        data: { userId, stockSymbol: symbol, quantity, avgBuyPrice: price },
      });
    }

    // Deduct cash
    const newCash = user.cash - totalCost;
    await this.prisma.user.update({
      where: { id: userId },
      data: { cash: newCash },
    });

    return { message: 'Trade successful', cash: newCash };
  }
}