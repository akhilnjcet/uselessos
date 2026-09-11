import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AlertTriangle, RefreshCw, Skull, CheckCircle } from 'lucide-react';

export const PaniPaaliApp = ({ onClose }) => {
  const { playSound, closeWindow } = useOS();
  const [status, setStatus] = useState('error'); // 'error', 'restarting', 'cancel'

  const handleRestart = () => {
    playSound('error');
    setStatus('restarting');

    setTimeout(() => {
      setStatus('cancel');
      setTimeout(() => {
        setStatus('error');
      }, 3500);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-red-950 text-slate-100 font-sans p-6 text-center select-none space-y-6 relative overflow-hidden border border-red-900">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md w-full">
        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-900/60 border border-red-500/50 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <Skull className="w-10 h-10 text-red-400" />
            </div>

            <div className="space-y-3 bg-red-900/30 p-5 rounded-2xl border border-red-800/50 backdrop-blur-md">
              <h2 className="text-2xl font-black text-red-400 uppercase tracking-widest font-mono">
                💀 PANI PAALI DETECTED
              </h2>
              <div className="text-left font-mono text-xs text-red-200 space-y-1.5 bg-slate-950/80 p-4 rounded-xl border border-red-900/60">
                <p>▶ STATUS: Critical Nonsense</p>
                <p>▶ REASON: Unknown Malayalam Error</p>
                <p>▶ SOLUTION: Restart & Hope for the best</p>
                <p className="text-amber-400 pt-1">▶ CODE: 0x000000000_CHAAYA_EMPTY</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-red-400/40"
            >
              <RefreshCw className="w-4 h-4" /> Restart System
            </button>
          </>
        )}

        {status === 'restarting' && (
          <div className="space-y-4 py-8">
            <RefreshCw className="w-12 h-12 text-amber-400 mx-auto animate-spin" />
            <h2 className="text-2xl font-bold text-amber-300 font-mono">
              Restarting…
            </h2>
            <p className="text-xs text-slate-400">
              Re-evaluating life choices and tea preferences...
            </p>
          </div>
        )}

        {status === 'cancel' && (
          <div className="space-y-4 py-8 bg-slate-900/90 p-6 rounded-2xl border border-amber-500/50 backdrop-blur-md animate-bounce">
            <CheckCircle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-black text-amber-300">
              അത് വേണ്ട. വെറുതെ ഇരിക്ക്.
            </h2>
            <p className="text-xs text-slate-300">
              Restarting won't change anything anyway. Returning to desktop...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
