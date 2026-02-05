
import React, { useState } from 'react';
import { InsightData } from '../types';

interface InsightCardProps {
  data: InsightData;
  onReset: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `SUMMARY: ${data.summary}\nTHEMES: ${data.themes.join(', ')}\nSIGNAL: ${data.toneSignal}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-3xl shadow-3xl overflow-hidden animate-fade-in border-white/5">
      {/* Header */}
      <div className="bg-slate-900/50 px-8 py-6 flex justify-between items-center border-b border-white/5">
        <div>
          <h2 className="text-slate-200 text-lg font-black uppercase tracking-tighter italic">Analysis <span className="text-indigo-500">Output</span></h2>
          <p className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest">TS: {Date.now()}</p>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all border border-slate-700"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      </div>

      <div className="p-8 space-y-10">
        {/* Core summary */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
             <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Executive Summary</span>
             <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold rounded border border-indigo-500/20 uppercase">
               Signal: {data.toneSignal}
             </span>
          </div>
          <p className="text-slate-200 text-xl font-medium leading-relaxed tracking-tight">{data.summary}</p>
        </section>

        {/* Structural Themes */}
        <section>
          <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Structural Dynamics</h3>
          <div className="flex flex-wrap gap-2">
            {data.themes.map((theme, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 shadow-sm">
                {theme}
              </span>
            ))}
          </div>
        </section>

        {/* Tactical inquiries */}
        <section className="bg-indigo-600/5 p-6 rounded-2xl border border-indigo-500/10 space-y-5">
          <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Tactical Reframes</h3>
          <div className="space-y-4">
            {data.reflectionPrompts.map((p, i) => (
              <div key={i} className="flex space-x-4">
                <span className="text-indigo-500 font-mono font-bold">0{i+1}</span>
                <p className="text-slate-300 text-sm italic font-medium leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Liability check */}
        {data.riskNote && (
          <section className="bg-red-500/5 border-l-2 border-red-500/50 p-5 rounded-r-2xl">
            <h3 className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mb-2">Professional Liability</h3>
            <p className="text-red-200/80 text-xs font-medium leading-relaxed">{data.riskNote}</p>
          </section>
        )}

        <button
          onClick={onReset}
          className="w-full py-4 text-[9px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-[0.3em] transition-all border-t border-white/5"
        >
          Initialize New Session
        </button>
      </div>
    </div>
  );
};
