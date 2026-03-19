'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type StockData = {
  price: number;
  change: number;
};

export default function StockPage() {
  const { symbol } = useParams();
  const router = useRouter();
  const [stock, setStock] = useState<StockData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState('');
  const [cash, setCash] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setCash(Number(localStorage.getItem('cash')) || 0);
    fetchStock();
    const interval = setInterval(fetchStock, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const fetchStock = async () => {
    try {
      const res = await fetch(`http://localhost:3001/stocks/${symbol}`);
      const data = await res.json();
      setStock(data);
    } catch (err) {
      console.error('Failed to fetch stock');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    setBuying(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/trades/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Trade failed');
        return;
      }
      setMessage(`Successfully bought ${quantity} share(s) of ${symbol}!`);
      setCash(data.cash);
      localStorage.setItem('cash', data.cash);
    } catch (err) {
      setMessage('Could not connect to server');
    } finally {
      setBuying(false);
    }
  };

  const totalCost = stock ? stock.price * quantity : 0;

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => router.push('/stocks')}
          className="text-zinc-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back to Stocks
        </button>

        {loading ? (
          <div className="text-zinc-400">Loading...</div>
        ) : stock ? (
          <>
            {/* Stock Header */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Buy Panel */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Buy {symbol}</h2>

              {message && (
                <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${message.includes('Successfully') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-zinc-400 text-sm mb-1 block">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Total Cost</span>
                  <span className="text-white font-semibold">${totalCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Available Cash</span>
                  <span className="text-white font-semibold">${cash.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={buying || totalCost > cash}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {buying ? 'Processing...' : `Buy ${quantity} share(s) for $${totalCost.toFixed(2)}`}
                </button>

                {totalCost > cash && (
                  <p className="text-red-400 text-sm text-center">Insufficient funds</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-zinc-400">Stock not found</div>
        )}
      </div>
    </div>
  );
}