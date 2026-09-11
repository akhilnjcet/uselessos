import React from 'react';
import { useOS } from '../context/OSContext';
import { Battery, Coffee, Zap, Settings, RefreshCw, X } from 'lucide-react';

export const BatteryPanel = ({ onClose }) => {
  const {
    batteryLevel,
    batteryStatus,
    chargeBatteryFull,
    fakeChargeBattery,
    openApp,
    playSound
  } = useOS();

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return '🔋';
    if (batteryLevel > 45) return '🔋';
    if (batteryLevel > 15) return '🔋';
    return '🪫';
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-emerald-400';
    if (batteryLevel > 20) return 'text-amber-400';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-80 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-[9500] p-4 flex flex-col gap-3 font-sans select-none animate-fadeIn border-amber-500/30 text-slate-100"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getBatteryIcon()}</span>
          <div>
            <h3 className="font-bold text-sm text-slate-100">MalayaliOS Battery</h3>
            <p className="text-[10px] text-slate-400">Simulated OS System Battery</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Percentage & Status Display */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center space-y-2">
        <div className={`text-4xl font-black font-mono tracking-tight ${getBatteryColor()}`}>
          {batteryLevel}%
        </div>

        {/* Battery Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              batteryLevel > 50
                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : batteryLevel > 20
                ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse'
            }`}
            style={{ width: `${batteryLevel}%` }}
          />
        </div>

        <div className="text-xs text-amber-300 font-mono font-semibold">
          Status: {batteryStatus}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => { chargeBatteryFull(); onClose(); }}
          className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all border border-amber-400/40"
        >
          <Coffee className="w-4 h-4" />
          <span>☕ Go To Chaaya Shop (Full Charge 100%)</span>
        </button>

        <button
          onClick={() => { fakeChargeBattery(); onClose(); }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>🔌 Fake Charge (0% ➔ 100%)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            openApp('settings', {}, '⚙️ Settings', '⚙️');
            onClose();
          }}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-800"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>⚙ Battery & Audio Settings</span>
        </button>
      </div>

      {/* Footer Note */}
      <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500 italic">
        "Battery is simulated by MalayaliOS."
      </div>
    </div>
  );
};
