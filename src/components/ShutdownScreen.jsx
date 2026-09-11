import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Power, RefreshCw } from 'lucide-react';

export const ShutdownScreen = () => {
  const { setIsShutdown, setIsBooted, resetBatteryOnBoot } = useOS();
  const [progress, setProgress] = useState(100);
  const [isOff, setIsOff] = useState(false);

  useEffect(() => {
    // 100% -> 75% -> 50% -> 25% -> 0% shutdown animation
    const steps = [100, 75, 50, 25, 0];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < steps.length) {
        setProgress(steps[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setIsOff(true);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handlePowerOn = () => {
    if (!isOff) return;
    resetBatteryOnBoot();
    setIsShutdown(false);
    setIsBooted(false); // Trigger boot sequence again
  };

  return (
    <div
      onClick={handlePowerOn}
      className={`fixed inset-0 bg-black text-slate-100 flex flex-col items-center justify-center p-6 z-[99999] select-none font-mono transition-all duration-500 ${
        isOff ? 'cursor-pointer' : 'cursor-wait'
      }`}
    >
      <div className="text-center space-y-6 max-w-sm w-full">
        <div className="w-24 h-24 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl text-red-500">
          {isOff ? (
            <Power className="w-12 h-12 text-red-500 animate-pulse" />
          ) : (
            <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
          )}
        </div>

        {!isOff ? (
          <div className="space-y-3">
            <h2 className="text-xl font-black text-amber-400">
              Shutting down UselessOS...
            </h2>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 relative p-0.5">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 font-mono">{progress}%</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-200 tracking-wider">
                USELESSOS IS OFF
              </h2>
              <p className="text-xs text-slate-400">
                “ശരി... ഞാൻ ഇറങ്ങുവാ. നാളെ വീണ്ടും കാണാം.”
              </p>
            </div>
            <div className="pt-6 text-amber-400 text-xs font-bold animate-bounce">
              ▶ Click anywhere to start UselessOS ⚡
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
