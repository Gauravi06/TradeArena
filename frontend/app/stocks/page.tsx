'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

export default function Stocks() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await fetch('http://localhost:3001/stocks');
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Stocks</h1>
          <p className="text-zinc-400 mt-1">Live market prices — updates every 30 seconds</p>
        </div>

        {loading ? (
          <div className="text-zinc-400">Loading prices...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => router.push(`/stocks/${stock.symbol}`)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-green-500 transition-colors"
              >
                <div>
                  <p className="text-white font-bold text-lg">{stock.symbol}</p>
                  <p className="text-zinc-400 text-sm">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-lg">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}