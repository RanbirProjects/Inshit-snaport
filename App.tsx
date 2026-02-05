
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ReflectionForm } from './components/ReflectionForm';
import { InsightCard } from './components/InsightCard';
import { AppStatus, AppState, SessionRecord, User } from './types';
import { generateInsight } from './services/insightEngine';

const LOADING_STEPS = [
  "Mounting encrypted volume...",
  "Calibrating neural weights...",
  "Parsing situational entropy...",
  "Formulating strategic reframes...",
  "Finalizing analysis report..."
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const savedHistory = localStorage.getItem('snapshot_history');
    const savedUser = localStorage.getItem('snapshot_user');
    return {
      status: savedUser ? AppStatus.IDLE : AppStatus.UNAUTHENTICATED,
      user: savedUser ? JSON.parse(savedUser) : null,
      input: '',
      result: null,
      error: null,
      history: savedHistory ? JSON.parse(savedHistory) : [],
    };
  });

  const [loadingStep, setLoadingStep] = useState(0);

  // Auto-sync persistence
  useEffect(() => {
    localStorage.setItem('snapshot_history', JSON.stringify(state.history));
    if (state.user) {
      localStorage.setItem('snapshot_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('snapshot_user');
    }
  }, [state.history, state.user]);

  // Loading animations
  useEffect(() => {
    let interval: number;
    if (state.status === AppStatus.LOADING) {
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [state.status]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    
    if (username.length < 3) return;

    setState(prev => ({
      ...prev,
      status: AppStatus.IDLE,
      user: {
        username: username,
        role: "Strategic Partner",
        lastLogin: Date.now()
      }
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    setState({
      status: AppStatus.UNAUTHENTICATED,
      user: null,
      input: '',
      result: null,
      error: null,
      history: [],
    });
  };

  const handleKeySelection = async () => {
    try {
      // @ts-ignore
      if (window.aistudio?.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      setState(prev => ({ ...prev, status: AppStatus.IDLE, error: null }));
    } catch (e) {
      console.error("Auth helper failed", e);
    }
  };

  const handleSubmit = async () => {
    const input = state.input.trim();
    if (input.length < 20) {
      setState(prev => ({ ...prev, error: "Insufficient input length for structural analysis." }));
      return;
    }

    setState(prev => ({ ...prev, status: AppStatus.LOADING, error: null }));

    try {
      const data = await generateInsight(input);
      const newRecord: SessionRecord = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        timestamp: Date.now(),
        reflection: input,
        insight: data
      };

      setState(prev => ({
        ...prev,
        status: AppStatus.SUCCESS,
        result: data,
        history: [newRecord, ...prev.history].slice(0, 20),
      }));
    } catch (err: any) {
      if (err.message === "AUTH_KEY_EXPIRED_OR_INVALID") {
        setState(prev => ({ ...prev, status: AppStatus.KEY_REQUIRED }));
      } else {
        setState(prev => ({
          ...prev,
          status: AppStatus.ERROR,
          error: err.message || "Processor offline. Connectivity failure.",
        }));
      }
    }
  };

  if (state.status === AppStatus.UNAUTHENTICATED) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
          <div className="glass p-10 rounded-3xl w-full max-w-md shadow-2xl border border-white/5 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">System Access</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Employee Portal v4.0</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Username / Corporate ID</label>
                <input 
                  name="username" 
                  type="text" 
                  required
                  placeholder="e.g. Executive_01"
                  className="w-full bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-medium" 
                />
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]">
                Enter Terminal
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={state.user} onLogout={handleLogout}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="glass rounded-2xl p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analytical Archive</h3>
              <span className="text-[10px] font-mono text-indigo-400">{state.history.length}/20</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
              {state.history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[10px] uppercase font-bold tracking-widest">No Records</p>
                </div>
              ) : (
                state.history.map(record => (
                  <button
                    key={record.id}
                    onClick={() => setState(prev => ({ ...prev, status: AppStatus.SUCCESS, result: record.insight, input: record.reflection }))}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-indigo-400">#{record.id}</span>
                      <span className="text-[9px] text-slate-500">{new Date(record.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-300 line-clamp-2 group-hover:text-white transition-colors">{record.reflection}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {state.status === AppStatus.KEY_REQUIRED ? (
            <div className="glass p-12 rounded-3xl text-center space-y-8 animate-fade-in">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                  <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">Access Restricted</h2>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  The current API synchronization has expired or is invalid. Please manually verify your credentials via the secure prompt.
                </p>
              </div>
              <button
                onClick={handleKeySelection}
                className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-600/20 uppercase text-xs tracking-widest"
              >
                Sync Credentials
              </button>
            </div>
          ) : state.status === AppStatus.SUCCESS && state.result ? (
            <InsightCard data={state.result} onReset={() => setState(prev => ({ ...prev, status: AppStatus.IDLE, result: null, input: '' }))} />
          ) : (
            <div className="space-y-6">
              <ReflectionForm
                value={state.input}
                onChange={(val) => setState(prev => ({ ...prev, input: val, error: null }))}
                onTryExample={() => setState(prev => ({ ...prev, input: "I found myself becoming argumentative during the board review because the CFO challenged my hiring budget. I realized I was projecting my own stress onto the data presentation." }))}
                onSubmit={handleSubmit}
                isLoading={state.status === AppStatus.LOADING}
              />
              
              {state.status === AppStatus.LOADING && (
                <div className="glass p-12 rounded-3xl text-center space-y-6 border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                  <div className="flex justify-center space-x-2">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">{LOADING_STEPS[loadingStep]}</p>
                    <div className="w-48 mx-auto bg-slate-800 h-0.5 mt-4 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-700" style={{width: `${((loadingStep+1)/LOADING_STEPS.length)*100}%`}}></div>
                    </div>
                  </div>
                </div>
              )}

              {state.error && (
                <div className="p-5 glass border-red-500/20 rounded-2xl flex items-start space-x-4 animate-fade-in">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Protocol Failure</p>
                    <p className="text-xs text-red-400/80 font-medium leading-relaxed">{state.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
