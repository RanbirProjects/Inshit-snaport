
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="font-black text-sm tracking-tighter uppercase italic">Insight <span className="text-indigo-500">Snapshot</span></span>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Logged in as</p>
              <p className="text-xs font-semibold text-slate-300">{user.username}</p>
            </div>
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center py-12">
        <div className="w-full max-w-5xl px-4">
          {children}
        </div>
      </main>

      <footer className="py-6 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">Proprietary Analysis Cluster v4.0.2</p>
      </footer>
    </div>
  );
};
