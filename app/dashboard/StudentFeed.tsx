'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Issue {
  _id: string;
  venue: string;
  description: string;
  severity: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
  reporterId: { fullName: string };
}

export default function StudentFeed() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch('/api/issues');
        const data = await res.json();
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Working On': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // if (loading) return <div className="p-10 text-center">Loading feed...</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-purple-950 mb-2">Campus Feed</h1>
        <p className="text-slate-500">Active maintenance issues across the university.</p>
      </div>

      {issues.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-pink-100 text-center shadow-sm">
          <p className="text-slate-500 text-lg mb-4">No active issues reported. The campus is looking good!</p>
          <Link href="/dashboard/report" className="text-purple-700 font-bold hover:text-pink-600">Be the first to report something →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <div key={issue._id} className="bg-white p-6 rounded-xl border border-pink-100 shadow-[0_4px_20px_-10px_rgba(236,72,153,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(236,72,153,0.15)] transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(issue.status)}`}>{issue.status}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity: {issue.severity}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-purple-950 mb-2">{issue.venue}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{issue.description}</p>
                {issue.imageUrl && (
                  <div className="mt-4 mb-2 rounded-lg overflow-hidden border border-slate-200 h-40 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={issue.imageUrl} alt="Issue" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}