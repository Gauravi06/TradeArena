'use client';

import { useEffect, useState } from 'react';

type LeaderboardEntry = {
  username: string;
  rank: string;
  totalValue: number;
  pnl: number;
  pnlPct: number;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('http://localhost:3001/leaderboard');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-zinc-400 mt-1">Top traders ranked by portfolio value</p>
        </div>

        {loading ? (
          <div className="text-zinc-400">Loading leaderboard...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, index) => (
              <div
                key={entry.username}
                className={`bg-zinc-900 border rounded-2xl px-6 py-4 flex items-center justify-between ${index === 0 ? 'border-yellow-500/50' : 'border-zinc-800'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">{getMedal(index)}</span>
                  <div>
                    <p className="text-white font-bold">{entry.username}</p>
                    <p className="text-zinc-400 text-sm">{entry.rank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${entry.totalValue.toFixed(2)}</p>
                  <p className={`text-sm font-medium ${entry.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)} ({entry.pnlPct.toFixed(2)}%)
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