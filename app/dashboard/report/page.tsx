'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ReportIssuePage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect the route
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Capture all form data, including the file
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        // Note: When using FormData, do NOT set the 'Content-Type' header. 
        // The browser automatically sets it to 'multipart/form-data' with the correct boundary.
        body: formData,
      });

      if (res.ok) {
        router.push('/dashboard'); // Redirect to feed on success
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to report issue.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 px-6 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        
        <Link href="/dashboard" className="text-sm font-semibold text-purple-900 hover:text-pink-600 transition-colors mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-xl border border-pink-100 shadow-[0_10px_40px_-15px_rgba(236,72,153,0.1)]">
          <h1 className="text-3xl font-black tracking-tight text-purple-950 mb-2">Report an Issue</h1>
          <p className="text-slate-500 mb-8">Fill out the details below to notify campus maintenance.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Venue / Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Venue / Location</label>
              <input 
                type="text" 
                name="venue"
                required
                placeholder="e.g., Science Building, Room 304"
                className="w-full px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              />
            </div>

            {/* Severity Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Severity</label>
              <select 
                name="severity"
                required
                defaultValue="Medium"
                className="w-full px-4 py-3 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all appearance-none"
              >
                <option value="Low">Low (Cosmetic, minor inconvenience)</option>
                <option value="Medium">Medium (Broken equipment, functional issue)</option>
                <option value="High">High (Major disruption to learning/living)</option>
                <option value="Critical">Critical (Safety hazard, flooding, power outage)</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea 
                name="description"
                required
                rows={4}
                placeholder="Please describe exactly what is broken..."
                className="w-full px-4 py-3 rounded-md border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Photo Reference (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-md px-6 py-8 text-center hover:border-pink-300 hover:bg-pink-50/50 transition-colors">
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 text-white font-bold bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Report...' : 'Submit Issue Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}