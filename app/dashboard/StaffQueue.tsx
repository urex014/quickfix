'use client';

import React, { useEffect, useState } from 'react';

interface Issue {
  _id: string;
  venue: string;
  description: string;
  severity: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
  reporterId: { fullName: string } | null;
}

export default function StaffQueue() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaffIssues = async () => {
    try {
      const res = await fetch('/api/staff/issues');
      const data = await res.json();
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffIssues();
  }, []);

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      setIssues((prev) => prev.map((issue) => issue._id === issueId ? { ...issue, status: newStatus } : issue));
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) fetchStaffIssues();
    } catch (error) {
      fetchStaffIssues();
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // if (loading) return <div className="p-10 text-center">Loading queue...</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-purple-950 mb-2">Maintenance Queue</h1>
        <p className="text-slate-500">Manage, prioritize, and resolve campus issues.</p>
      </div>

      <div className="bg-white rounded-xl border border-pink-100 shadow-[0_4px_20px_-10px_rgba(236,72,153,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Photo</th>
                <th className="px-6 py-4 font-semibold">Venue & Details</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4">
                    {issue.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={issue.imageUrl} alt="Issue" className="w-16 h-16 object-cover rounded-md border border-slate-200" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">No Photo</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-normal min-w-[250px]">
                    <div className="font-bold text-purple-900 mb-1">{issue.venue}</div>
                    <div className="text-slate-500 text-xs line-clamp-2">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityBadge(issue.severity)}`}>{issue.severity}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="px-4 py-2 border rounded-md text-sm font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Reported">Reported</option>
                      <option value="Working On">Working On</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}