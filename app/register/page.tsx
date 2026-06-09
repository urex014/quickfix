'use client'; // This is crucial for interactive forms in Next.js

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect to login page on success
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 font-sans selection:bg-pink-200">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-sm font-semibold text-purple-900 hover:text-pink-600 transition-colors flex items-center gap-2">
          ← Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(236,72,153,0.1)] border border-pink-100 my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-purple-950 mb-2">Create Account</h1>
          <p className="text-slate-500 text-sm">Join Quick Fix to report and track issues.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Jane Doe"
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">University Email</label>
            <input 
              type="email" 
              required
              placeholder="you@university.edu"
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a...</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="" disabled selected>Select your role</option>
              <option value="student">Student</option>
              <option value="staff">Staff Member</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-md border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 text-white font-bold bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-purple-800 hover:text-pink-600 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}