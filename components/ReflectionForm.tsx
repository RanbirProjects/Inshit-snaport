
import React from 'react';

interface ReflectionFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onTryExample: () => void;
  isLoading: boolean;
}

export const ReflectionForm: React.FC<ReflectionFormProps> = ({ value, onChange, onSubmit, onTryExample, isLoading }) => {
  const charCount = value.length;
  const minChars = 20;

  return (
    <div className="glass p-8 rounded-3xl shadow-2xl space-y-6 transition-all border-white/5">
      <div>
        <div className="flex justify-between items-end mb-3">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Reflection Data Buffer</label>
          <span className={`text-[9px] font-mono font-bold ${charCount < minChars && charCount > 0 ? 'text-amber-500' : 'text-slate-600'}`}>
            LEN: {charCount} / {minChars} MIN
          </span>
        </div>
        <textarea
          rows={8}
          className="block w-full rounded-2xl bg-[#1e293b]/50 border border-slate-700/50 shadow-inner focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 text-slate-200 p-6 transition-all text-base resize-none outline-none placeholder:text-slate-600"
          placeholder="Analyze a specific professional dynamic..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSubmit}
          disabled={isLoading || charCount < minChars}
          className={`flex-1 flex justify-center items-center py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
            isLoading || charCount < minChars 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
          }`}
        >
          {isLoading ? 'Processing' : 'Execute Analysis'}
        </button>

        {!value && !isLoading && (
          <button
            onClick={onTryExample}
            className="px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 border border-slate-800 hover:border-indigo-900 transition-all"
          >
            Example
          </button>
        )}
      </div>
    </div>
  );
};
