import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StocksService } from '../stocks/stocks.service';

@Injectable()
export class TradesService 
{
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
      data: { type: 'buy', quantity, price, userId, stockSymbol: symbol },
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

    const newCash = user.cash - totalCost;
    await this.prisma.user.update({
      where: { id: userId },
      data: { cash: newCash },
    });

    return { message: 'Trade successful', cash: newCash };
  }

  async getPortfolio(userId: string) {
    const holdings = await this.prisma.portfolioHolding.findMany({
      where: { userId },
      include: { stock: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let totalValue = 0;
    let totalCost = 0;

    const enriched = await Promise.all(
      holdings.map(async (holding) => {
        const { price } = await this.stocksService.getPrice(holding.stockSymbol);
        const currentValue = price * holding.quantity;
        const costBasis = holding.avgBuyPrice * holding.quantity;
        const pnl = currentValue - costBasis;
        const pnlPct = (pnl / costBasis) * 100;

        totalValue += currentValue;
        totalCost += costBasis;

        return {
          symbol: holding.stockSymbol,
          quantity: holding.quantity,
          avgBuyPrice: holding.avgBuyPrice,
          currentPrice: price,
          currentValue,
          pnl,
          pnlPct,
        };
      })
    );

    return {
      holdings: enriched,
      cash: user?.cash ?? 0,
      totalValue,
      totalCost,
      totalPnl: totalValue - totalCost,
    };
  }

  async sellStock(userId: string, symbol: string, quantity: number) {
  const { price } = await this.stocksService.getPrice(symbol);
  if (!price) throw new BadRequestException('Invalid stock symbol');

  const holding = await this.prisma.portfolioHolding.findUnique({
    where: { userId_stockSymbol: { userId, stockSymbol: symbol } },
  });

  if (!holding) throw new BadRequestException('You do not own this stock');
  if (holding.quantity < quantity) throw new BadRequestException('Not enough shares');

  // Record the trade
  await this.prisma.trade.create({
    data: { type: 'sell', quantity, price, userId, stockSymbol: symbol },
  });

  // Update or remove holding
  if (holding.quantity === quantity) {
    await this.prisma.portfolioHolding.delete({
      where: { userId_stockSymbol: { userId, stockSymbol: symbol } },
    });
  } else {
    await this.prisma.portfolioHolding.update({
      where: { userId_stockSymbol: { userId, stockSymbol: symbol } },
      data: { quantity: holding.quantity - quantity },
    });
  }

  // Add cash back
  const earned = price * quantity;
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  const newCash = (user?.cash ?? 0) + earned;
  await this.prisma.user.update({
    where: { id: userId },
    data: { cash: newCash },
  });

  return { message: 'Sold successfully', cash: newCash };
}

}