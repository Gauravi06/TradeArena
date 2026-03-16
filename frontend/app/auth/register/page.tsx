'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }
      router.push('/auth/login');
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-zinc-400 mb-6">Join TradeArena and start trading</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              placeholder="tradingpro"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-zinc-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-black font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="text-zinc-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-500 hover:text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}