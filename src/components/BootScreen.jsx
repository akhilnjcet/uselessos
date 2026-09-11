import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Terminal, Coffee, Sparkles } from 'lucide-react';

const BOOT_STEPS = [
  "Starting MalayaliOS…",
  "Checking unnecessary files…",
  "Searching for common sense…",
  "Common sense not found.",
  "Installing comedy…",
  "Loading troll database…",
  "Loading tea…",
  "Connecting to നാട്ടിലെ WiFi…",
  "Connection successful.",
  "System ready."
];

export const BootScreen = () => {
  const { setIsBooted, playSound } = useOS();
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [specialQuote, setSpecialQuote] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    playSound('boot');

    // Message stream interval
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      if (msgIdx < BOOT_STEPS.length) {
        setMessages((prev) => [...prev, BOOT_STEPS[msgIdx]]);
        msgIdx++;
      } else {
        clearInterval(msgInterval);
      }
    }, 320);

    // Progress percentage loop
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 3;
      
      if (currentProgress >= 98 && currentProgress < 100) {
        currentProgress = 98;
        setProgress(98);
        setSpecialQuote("ഇനി എന്തിനാ ഇത്രയും പെട്ടെന്ന്?");
        clearInterval(progressInterval);
        
        // Pause at 98% for comedy effect
        setTimeout(() => {
          setSpecialQuote("");
          setProgress(100);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => setIsBooted(true), 600);
          }, 400);
        }, 1800);
      } else if (currentProgress < 98) {
        setProgress(currentProgress);
      }
    }, 150);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleSkip = () => {
    setIsDone(true);
    setTimeout(() => setIsBooted(true), 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-slate-950 text-emerald-400 font-mono flex flex-col justify-between p-6 sm:p-12 z-[9999] transition-opacity duration-700 ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-emerald-500 animate-pulse" />
          <span className="font-bold text-xl tracking-wider text-emerald-300">
            MALAYALIOS™ v1.0
          </span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 px-3 py-1.5 rounded border border-emerald-700/50 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Skip Boot
        </button>
      </div>

      {/* Center Console Output */}
      <div className="my-auto max-w-2xl w-full mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight">
            MALAYALIOS™
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-sans font-medium">
            The world's most unnecessary operating system.
          </p>
        </div>

        {/* Console Log Lines */}
        <div className="bg-slate-900/80 border border-emerald-900/60 rounded-xl p-4 sm:p-6 shadow-2xl h-48 sm:h-56 overflow-y-auto space-y-1.5 font-mono text-xs sm:text-sm text-slate-300 backdrop-blur-md">
          {messages.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2 animate-fadeIn">
              <span className="text-emerald-500 font-semibold">[OK]</span>
              <span>{msg}</span>
            </div>
          ))}
          {specialQuote && (
            <div className="text-amber-400 font-bold text-sm sm:text-base py-2 flex items-center gap-2 animate-bounce">
              <Coffee className="w-5 h-5 text-amber-400" />
              <span>{specialQuote}</span>
            </div>
          )}
        </div>

        {/* Loading Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-emerald-400/90 font-medium">
            <span>BOOTING SYSTEM</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-emerald-900/50 relative p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-200 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-slate-600 border-t border-emerald-900/30 pt-3">
        © MalayaliOS Comedy Engine • No Common Sense Found • All rights reserved
      </div>
    </div>
  );
};
