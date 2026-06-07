'use client';

import { useEffect, useRef } from 'react';

type StockChartProps = {
  symbol: string;
  currentPrice: number;
};

export default function StockChart({ symbol, currentPrice }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadChart = async () => {
      try {
        const { createChart, ColorType } = await import('lightweight-charts');

        const chart = createChart(containerRef.current!, {
          layout: {
            background: { type: ColorType.Solid, color: '#18181b' },
            textColor: '#a1a1aa',
          },
          width: containerRef.current!.clientWidth,
          height: 400,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });

        const lineSeries = chart.addLineSeries({
          color: '#10b981',
          lineWidth: 2,
        });

        // Fetch data
        const res = await fetch(
          `http://localhost:3001/stocks/${symbol}/history?days=7`
        );
        const data = await res.json();

        if (data && Array.isArray(data) && data.length > 0) {
          lineSeries.setData(data);
          chart.timeScale().fitContent();
        }

        // Handle resize
        const handleResize = () => {
          if (containerRef.current) {
            chart.applyOptions({
              width: containerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
        };
      } catch (err) {
        console.error('Chart error:', err);
      }
    };

    loadChart();
  }, [symbol]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase">
        7-Day Price Chart
      </h2>
      <div ref={containerRef} className="w-full" style={{ height: '400px' }} />
    </div>
  );
}