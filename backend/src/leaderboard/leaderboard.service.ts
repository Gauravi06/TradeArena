import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        cash: true,
        rank: true,
        holdings: {
          select: {
            quantity: true,
            avgBuyPrice: true,
            stock: {
              select: { price: true },
            },
          },
        },
      },
    });

    const ranked = users.map((user) => {
      const holdingsValue = user.holdings.reduce((sum, h) => {
        return sum + h.quantity * h.stock.price;
      }, 0);
      const totalValue = user.cash + holdingsValue;
      const pnl = totalValue - 100000;
      const pnlPct = (pnl / 100000) * 100;

      return {
        username: user.username,
        rank: user.rank,
        totalValue,
        pnl,
        pnlPct,
      };
    });

    return ranked.sort((a, b) => b.totalValue - a.totalValue);
  }
}