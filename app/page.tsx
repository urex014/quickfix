import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-white to-purple-300 text-slate-900 font-sans selection:bg-pink-500">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <div className="text-2xl font-black tracking-tighter text-purple-950">
          Quick<span className="text-pink-500">Fix</span>.
        </div>
        <div className="space-x-6 text-sm font-medium">
          <Link href="/login" className="text-slate-600 hover:text-purple-900 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 text-white bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:opacity-90 transition-opacity shadow-md"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-black tracking-tight leading-tight mb-6 text-purple-950">
            Broken stuff on Campus? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-500">
              Let's get them fixed.
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
            A bad seat in the lecture room. A leaky pipe in the hostels. A broken projector. 
            Don't just walk past it, report it. Quick Fix routes campus maintenance issues 
            directly to the people who can solve them.
          </p>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/report" 
              className="px-8 py-4 text-white font-semibold bg-gradient-to-r from-purple-800 to-pink-500 rounded-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Report an Issue Now
            </Link>
            <Link 
              href="/dashboard" 
              className="px-8 py-4 font-semibold text-purple-900 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
            >
              View Open Issues
            </Link>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section className="bg-pink-50 py-24 border-y border-pink-100 shadow-[0_-10px_40px_-15px_rgba(236,72,153,0.05)]">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-purple-950 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Spot & Snap</h3>
              <p className="text-slate-600 leading-relaxed">
                See something broken? Take a quick picture. A visual reference helps the maintenance team know exactly what they are dealing with before they arrive.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Log the Details</h3>
              <p className="text-slate-600 leading-relaxed">
                Select the venue, write a brief description, and set the severity. Whether it's a minor inconvenience or a major hazard, tag it accurately.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Track the Fix</h3>
              <p className="text-slate-600 leading-relaxed">
                No more wondering if anyone actually read your report. Watch the status change from "Reported" to "Working On" to "Resolved" on the public dashboard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Quick Fix. Built by students, for the campus.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          {/* <Link href="/privacy" className="hover:text-purple-800">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-purple-800">Terms of Service</Link> */}
        </div>
      </footer>
    </div>
  );
}