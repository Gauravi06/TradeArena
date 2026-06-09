'use client';

import { useState, useEffect, useMemo } from 'react';

type StockChartProps = {
  symbol: string;
  currentPrice: number;
};

export default function StockChart({ symbol, currentPrice }: StockChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/stocks/${symbol}/history?days=7`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setChartData(data);
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      }
    };
    fetchData();
  }, [symbol]);

  const { minPrice, maxPrice, range } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 100, range: 100 };
    const min = Math.min(...chartData.map(d => d.value));
    const max = Math.max(...chartData.map(d => d.value));
    return { minPrice: min, maxPrice: max, range: max - min || 1 };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase">7-Day Price Chart</h2>
        <div className="h-80 flex items-center justify-center text-zinc-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wide">
        7-Day Price Chart
      </h2>
      <svg width="100%" height="300" viewBox="0 0 800 300" className="w-full">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1="40"
            x2="780"
            y1={60 + i * 60}
            y2={60 + i * 60}
            stroke="#27272a"
            strokeWidth="1"
          />
        ))}

        {/* Chart line */}
        <polyline
          points={chartData
            .map((d, i) => {
              const x = 40 + (i / (chartData.length - 1)) * 740;
              const y = 260 - ((d.value - minPrice) / range) * 200;
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => (
          <text
            key={`label-${i}`}
            x="35"
            y={65 + i * 60}
            textAnchor="end"
            fontSize="12"
            fill="#a1a1aa"
          >
            ${(minPrice + (range * (4 - i)) / 4).toFixed(0)}
          </text>
        ))}

        {/* Current price indicator */}
        <circle
          cx={40 + 740}
          cy={260 - ((currentPrice - minPrice) / range) * 200}
          r="4"
          fill="#10b981"
        />
      </svg>

      <div className="mt-4 text-sm text-zinc-400">
        <p>Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}