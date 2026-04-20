# TradeArena 🏆

A full-stack gamified stock trading simulator. Trade real stocks with virtual money, compete on the leaderboard, and climb the ranks from Beginner Trader to Market Wizard.

---

## Features
- Live stock prices via Finnhub API (server-side cached)
- Buy and sell stocks with $100,000 virtual cash
- Portfolio tracking with real-time P&L calculations
- Global leaderboard ranked by portfolio value
- JWT authentication with bcrypt password hashing

---

## How It Works
1. User registers and receives $100,000 in virtual cash
2. Live stock prices are fetched from Finnhub and cached server-side
3. Users buy/sell stocks — trades are recorded in the database
4. Portfolio value updates in real time based on current prices
5. Leaderboard ranks all users by total portfolio value

---

## Tech Stack
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, REST API
- **Database:** PostgreSQL on Supabase, Prisma ORM
- **Auth:** JWT + bcrypt
- **Stock Prices:** Finnhub API

---

## Project Structure
```
TradeArena/
│
├── frontend/
│   ├── app/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── stocks/
│   │   ├── portfolio/
│   │   └── leaderboard/
│   └── components/
│       └── Navbar.tsx
│
├── backend/
│   └── src/
│       ├── auth/
│       ├── stocks/
│       ├── trades/
│       ├── leaderboard/
│       └── prisma.service.ts
│
├── ROADMAP.md
└── README.md
```


---

## Future Scope
- Price charts with historical data
- Achievements and rank progression system
- Daily trading challenges and tournament mode
- Learning module with guided missions and quizzes
- Market events that affect stock prices in real time

---