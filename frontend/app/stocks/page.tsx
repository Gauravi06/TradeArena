'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';


type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

export default function Stocks() {
  const router = useRouter();
  const { currency, convert } = useCurrency();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  // Filter - must match FULL search string
  const filtered = stocks.filter((s) => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;
    
    return (
      s.symbol.toLowerCase().includes(searchLower) ||
      s.name.toLowerCase().includes(searchLower)
    );
  });

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!search.trim()) return text;
    
    const searchLower = search.toLowerCase();
    const index = text.toLowerCase().indexOf(searchLower);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-green-500/30 text-green-300 font-semibold px-1 rounded">
          {text.substring(index, index + search.length)}
        </span>
        {text.substring(index + search.length)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Stocks</h1>
            <p className="text-zinc-400 mt-1">Live market prices — updates every 30 seconds</p>
          </div>
          <input
            type="text"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 w-64 transition-all"
          />
        </div>

        {loading ? (
          <div className="text-zinc-400">Loading prices...</div>
        ) : (
          <>
            {search.trim() && (
              <p className="text-zinc-400 text-sm mb-4">
                Found <span className="text-green-400 font-semibold">{filtered.length}</span> stock{filtered.length !== 1 ? 's' : ''} matching "<span className="text-green-400">{search}</span>"
              </p>
            )}
            {filtered.length === 0 && search.trim() && (
              <p className="text-zinc-500 text-center py-10">No stocks found matching "{search}"</p>
            )}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => router.push(`/stocks/${stock.symbol}`)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 cursor-pointer hover:border-green-500 transition-all hover:scale-[1.02] hover:bg-zinc-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold text-xl">{highlightMatch(stock.symbol)}</p>
                        <p className="text-zinc-400 text-sm mt-0.5">{highlightMatch(stock.name)}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stock.change >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{currency === 'INR' ? '₹' : '$'}{convert(stock.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}