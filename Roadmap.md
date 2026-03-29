# TradeArena — Roadmap

## MVP (Complete)
- User authentication (register, login, logout)
- Real-time stock prices via Finnhub API with server-side caching
- Buy and sell stocks with virtual $100,000
- Portfolio tracking with P&L calculations
- Leaderboard ranked by portfolio value
- Responsive UI with Tailwind CSS

---

## In Progress
- Stock grid view + UI polish
- Price charts (TradingView Lightweight Charts)
- Deployment (Vercel + Railway)

---

## Planned Features

### Phase 2 — Core Enhancements
- [ ] Price charts for each stock (historical data)
- [ ] Transaction history page
- [ ] Currency toggle (USD / INR)
- [ ] Search and filter on stocks page

### Phase 3 — Gamification
- [ ] Rank system (Beginner Trader → Retail Warrior → Hedge Fund Manager → Market Wizard)
- [ ] Achievements & badges (First Trade, 10% gain, 5 win streak, Portfolio doubled)
- [ ] Daily login streak
- [ ] Activity feed ("gauravi just bought TSLA")

### Phase 4 — Game Modes
- [ ] Daily Challenge (same stocks, same capital, 24 hours, best return wins)
- [ ] Season system (30 day resets, season champion badge)
- [ ] Tournament mode (bracket-style, top 10 advance)
- [ ] Market Events (random events affecting stock prices)

### Phase 5 — Learning Module
- [ ] Concepts library (stocks, P/E ratio, market cap, bull/bear markets)
- [ ] Guided missions ("Buy your first stock", "Diversify across 3 sectors")
- [ ] Glossary of trading terms
- [ ] Quiz mode before trading

### Phase 6 — Social Features
- [ ] Follow other traders
- [ ] Public portfolios
- [ ] Per-stock chat
- [ ] Copy trading (paper trading)

### Phase 7 — Advanced
- [ ] Scenario mode (2008 crash, COVID crash, dot-com bubble)
- [ ] AI trader bots (MomentumBot, ValueBot, RandomBot)
- [ ] Risk score system
- [ ] Sharpe ratio tracking

---

## 🛠 Tech Debt / Improvements
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Add Redis for leaderboard caching
- [ ] WebSockets for real-time price updates
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints