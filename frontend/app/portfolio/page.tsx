'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Holding = {
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
};

type Portfolio = {
  holdings: Holding[];
  cash: number;
  totalValue: number;
  totalCost: number;
  totalPnl: number;
};

export default function Portfolio() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/trades/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
          <p className="text-zinc-400 mt-1">Your holdings and performance</p>
        </div>

        {loading ? (
          <div className="text-zinc-400">Loading portfolio...</div>
        ) : portfolio ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">Cash</p>
                <p className="text-white font-bold text-xl mt-1">${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">Holdings Value</p>
                <p className="text-white font-bold text-xl mt-1">${portfolio.totalValue.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">Total Portfolio</p>
                <p className="text-white font-bold text-xl mt-1">${(portfolio.cash + portfolio.totalValue).toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-400 text-sm">Total P&L</p>
                <p className={`font-bold text-xl mt-1 ${portfolio.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolio.totalPnl >= 0 ? '+' : ''}${portfolio.totalPnl.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Holdings Table */}
            {portfolio.holdings.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <p className="text-zinc-400">You don't own any stocks yet.</p>
                <button
                  onClick={() => router.push('/stocks')}
                  className="mt-4 bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-full transition-colors"
                >
                  Browse Stocks
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {portfolio.holdings.map((holding) => (
                  <div
                    key={holding.symbol}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-bold text-lg">{holding.symbol}</p>
                      <p className="text-zinc-400 text-sm">{holding.quantity} shares · Avg ${holding.avgBuyPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${holding.currentValue.toFixed(2)}</p>
                      <p className={`text-sm font-medium ${holding.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)} ({holding.pnlPct.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-zinc-400">Failed to load portfolio.</div>
        )}
      </div>
    </div>
  );
}