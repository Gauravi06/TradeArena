import Link from "next/link";

export default function Navbar() {
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
      <div className="flex gap-3">
        <Link href="/auth/login" className="text-zinc-400 hover:text-white transition-colors">
          Login
        </Link>
        <Link href="/auth/register" className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-full transition-colors">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}