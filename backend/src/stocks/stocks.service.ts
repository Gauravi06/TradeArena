import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const STOCKS = [
  // Big Tech
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  // High Volatility / Meme Stocks
  { symbol: 'GME', name: 'GameStop Corp.' },
  { symbol: 'AMC', name: 'AMC Entertainment' },
  { symbol: 'PLTR', name: 'Palantir Technologies' },
  { symbol: 'RIVN', name: 'Rivian Automotive' },
  { symbol: 'LCID', name: 'Lucid Group' },
  { symbol: 'SOFI', name: 'SoFi Technologies' },
  // Crypto-adjacent / Volatile Tech
  { symbol: 'COIN', name: 'Coinbase Global' },
  { symbol: 'MSTR', name: 'MicroStrategy Inc.' },
  { symbol: 'HOOD', name: 'Robinhood Markets' },
  // EV & Energy
  { symbol: 'NIO', name: 'NIO Inc.' },
  { symbol: 'XPEV', name: 'XPeng Inc.' },
  // Biotech (very volatile)
  { symbol: 'MRNA', name: 'Moderna Inc.' },
  { symbol: 'BNTX', name: 'BioNTech SE' },
  // Airlines (volatile)
  { symbol: 'AAL', name: 'American Airlines' },
  { symbol: 'SPCE', name: 'Virgin Galactic' },
];

@Injectable()
export class StocksService {
  private cache: Map<string, { price: number; change: number; timestamp: number }> = new Map();
  private CACHE_TTL = 60 * 1000; // 60 seconds

  constructor(private prisma: PrismaService) {}

  async getStocks() {
    const results: { symbol: string; name: string; price: number; change: number }[] = [];
    for (const stock of STOCKS) {
      const data = await this.getPrice(stock.symbol);
      results.push({
        symbol: stock.symbol,
        name: stock.name,
        price: data.price,
        change: data.change,
      });
    }

    return results;
  }

  async getPrice(symbol: string) {
    const cached = this.cache.get(symbol);
    const now = Date.now();

    // Return cached price if still fresh
    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      return cached;
    }

    // Fetch from Finnhub
    try {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
      );
      const data = await res.json();

      const price = data.c ?? 0;
      const change = data.dp ?? 0;

      this.cache.set(symbol, { price, change, timestamp: now });
      return { price, change };
    } catch (err) {
      return { price: 0, change: 0 };
    }
  }
}
