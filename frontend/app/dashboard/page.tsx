'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [cash, setCash] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setUsername(localStorage.getItem('username') || '');
    setCash(Number(localStorage.getItem('cash')) || 0);
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/trades/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCash(data.cash);
      setTotalValue(data.cash + data.totalValue);
      setTotalPnl(data.totalPnl);
    } catch (err) {
      console.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {username} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Here's your trading overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">Available Cash</p>
            <p className="text-2xl font-bold text-white mt-1">
              ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">Total Portfolio</p>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? '...' : `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">Total P&L</p>
            <p className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {loading ? '...' : `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => router.push('/stocks')}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-green-500 transition-colors"
          >
            <h2 className="text-white font-semibold text-lg">Browse Stocks</h2>
            <p className="text-zinc-400 text-sm mt-1">View prices and buy stocks</p>
          </div>
          <div
            onClick={() => router.push('/portfolio')}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:border-green-500 transition-colors"
          >
            <h2 className="text-white font-semibold text-lg">My Portfolio</h2>
            <p className="text-zinc-400 text-sm mt-1">View your holdings and trades</p>
          </div>
        </div>

      </div>
    </div>
  );
}