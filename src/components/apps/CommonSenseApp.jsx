import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Brain, RefreshCw, XCircle } from 'lucide-react';

export const CommonSenseApp = () => {
  const { playSound, addNotification } = useOS();
  const [progress, setProgress] = useState(1);
  const [isSearching, setIsSearching] = useState(true);
  const [notFoundMessage, setNotFoundMessage] = useState('');

  useEffect(() => {
    runSearch();
  }, []);

  const runSearch = () => {
    setIsSearching(true);
    setProgress(1);
    setNotFoundMessage('');
    playSound('click');

    const steps = [
      { p: 25, delay: 500 },
      { p: 67, delay: 1100 },
      { p: 99, delay: 1800 },
      { p: 100, delay: 2400 }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setProgress(step.p);
        if (step.p === 100) {
          setIsSearching(false);
          comedyAudio.play('commonSense1');
        }
      }, step.delay);
    });
  };

  const handleSearchAgain = () => {
    const quotes = [
      'commonSense1',
      'commonSense2',
      'commonSense3',
      'commonSense4'
    ];
    const textMap = {
      'commonSense1': 'അത് ഇവിടെ ഇല്ല.',
      'commonSense2': 'കിട്ടിയില്ല.',
      'commonSense3': 'ഇനി നോക്കണ്ട.',
      'commonSense4': 'എനിക്കും അറിയില്ല.'
    };
    const randomKey = quotes[Math.floor(Math.random() * quotes.length)];
    const msg = textMap[randomKey];

    playSound('error');
    comedyAudio.play(randomKey);
    setNotFoundMessage(msg);
    addNotification('🧠 Common Sense Search', msg, '❌');
  };

  const handleGiveUp = () => {
    playSound('click');
    addNotification('🧠 Common Sense', 'നല്ല തീരുമാനം! 👏 (Wise decision)', '💡');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans p-6 text-center select-none space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-purple-500/40 flex items-center justify-center text-4xl shadow-2xl relative">
        <Brain className={`w-10 h-10 text-purple-400 ${isSearching ? 'animate-pulse' : ''}`} />
      </div>

      <div className="space-y-2 max-w-sm w-full">
        <h2 className="text-xl font-black text-slate-200 tracking-tight">
          🧠 Common Sense.exe
        </h2>
        {isSearching ? (
          <p className="text-xs text-purple-300 font-mono">
            Searching for Common Sense... {progress}%
          </p>
        ) : (
          <div className="space-y-2 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-500/50 rounded-full text-red-400 text-xs font-bold">
              <XCircle className="w-3.5 h-3.5" />
              <span>Common Sense Not Found</span>
            </div>
            <p className="text-xs text-slate-400">
              System searched everywhere (Brain, OS, Internet). Zero results.
            </p>
            {notFoundMessage && (
              <p className="text-sm font-bold text-amber-300 italic pt-1 animate-slideDown">
                “{notFoundMessage}”
              </p>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-purple-500 to-amber-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Action Buttons */}
      {!isSearching && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSearchAgain}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> SEARCH AGAIN
          </button>
          <button
            onClick={handleGiveUp}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            GIVE UP
          </button>
        </div>
      )}
    </div>
  );
};
