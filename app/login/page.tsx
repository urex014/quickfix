'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call NextAuth's signIn method
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // We handle the redirect manually so we can show errors
    });

    if (res?.error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      // Success! Send them to the main dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 font-sans selection:bg-pink-200">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-sm font-semibold text-purple-900 hover:text-pink-600 transition-colors flex items-center gap-2">
          ← Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(236,72,153,0.1)] border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-purple-950 mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Sign in to track your facility reports.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">University Email</label>
            <input 
              type="email" 
              required
              placeholder="you@university.edu"
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-white font-bold bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-bold text-purple-800 hover:text-pink-600 transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}