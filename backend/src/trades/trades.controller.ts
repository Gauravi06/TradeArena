import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { TradesService } from './trades.service';
import * as jwt from 'jsonwebtoken';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post('buy')
  async buy(
    @Headers('authorization') auth: string,
    @Body() body: { symbol: string; quantity: number },
  ) {
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as any;
    return this.tradesService.buyStock(decoded.userId, body.symbol, body.quantity);
  }
}