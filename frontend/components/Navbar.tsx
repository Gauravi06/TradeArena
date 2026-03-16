'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername('');
    router.push('/');
  };

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-white font-bold text-xl">
        TradeArena
      </Link>
      <div className="flex gap-6">
        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link href="/stocks" className="text-zinc-400 hover:text-white transition-colors">
          Stocks
        </Link>
        <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
          Portfolio
        </Link>
        <Link href="/leaderboard" className="text-zinc-400 hover:text-white transition-colors">
          Leaderboard
        </Link>
      </div>

      {username ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-black text-xs font-bold">
              {username[0].toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href="/auth/login" className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-4 py-1.5 rounded-full transition-colors">
            Login
          </Link>
          <Link href="/auth/register" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-full transition-colors">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}