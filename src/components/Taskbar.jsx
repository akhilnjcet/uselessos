import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { StartMenu } from './StartMenu';
import { BatteryPanel } from './BatteryPanel';
import { Wifi, Battery, Volume2, VolumeX } from 'lucide-react';

export const Taskbar = () => {
  const {
    windows,
    activeWindowId,
    focusWindow,
    minimizeWindow,
    isMuted,
    toggleMute,
    openApp,
    batteryLevel
  } = useOS();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Clock Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskbarTabClick = (win) => {
    if (win.isMinimized) {
      focusWindow(win.id);
    } else if (activeWindowId === win.id) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return '🔋';
    if (batteryLevel > 45) return '🔋';
    if (batteryLevel > 15) return '🔋';
    return '🪫';
  };

  return (
    <>
      {/* Start Menu Flyout */}
      {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}

      {/* Battery Panel Flyout */}
      {isBatteryOpen && <BatteryPanel onClose={() => setIsBatteryOpen(false)} />}

      {/* Fixed Bottom Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-2xl flex items-center justify-between px-3 z-[9000] select-none shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {/* Left: Start Button & Quick Launcher */}
        <div className="flex items-center gap-2">
          {/* Start Menu Trigger */}
          <button
            onClick={() => { setIsStartOpen(!isStartOpen); setIsBatteryOpen(false); }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isStartOpen
                ? 'bg-amber-500 text-slate-950 scale-105 shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/60'
            }`}
          >
            <span className="text-base">🌴</span>
            <span className="hidden sm:inline tracking-wider font-mono">
              MALAYALIOS
            </span>
          </button>

          {/* Quick Launcher Icons */}
          <div className="hidden md:flex items-center gap-1 border-l border-slate-800/80 pl-2">
            <button
              onClick={() => openApp('chaaya', {}, '☕ Chaaya App', '☕')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-400 transition-colors cursor-pointer"
              title="Chaaya Stall"
            >
              ☕
            </button>
            <button
              onClick={() => openApp('uselessAI', {}, '🧠 Useless AI', '🧠')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-purple-400 transition-colors cursor-pointer"
              title="Useless AI"
            >
              🧠
            </button>
            <button
              onClick={() => openApp('trollCenter', {}, '🤣 Troll Center', '🤣')}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-red-400 transition-colors cursor-pointer"
              title="Troll Center"
            >
              🤣
            </button>
          </div>
        </div>

        {/* Center: Open Window Tabs */}
        <div className="flex-1 px-4 flex items-center gap-2 overflow-x-auto custom-scrollbar justify-center">
          {windows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <button
                key={win.id}
                onClick={() => handleTaskbarTabClick(win)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-2 max-w-[180px] truncate cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/50 shadow-md scale-105'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{win.icon}</span>
                <span className="truncate">{win.title}</span>
                <div
                  className={`w-1.5 h-1.5 rounded-full ml-auto ${
                    isActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: System Tray & Clock */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute OS' : 'Mute OS'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* WiFi Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400"
            title="നാട്ടിലെ WiFi - 5G (No Signal)"
          >
            <Wifi className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline">നാട്ടിലെ WiFi</span>
          </div>

          {/* Interactive Battery Indicator & Shake Animation when < 20% */}
          <button
            onClick={() => { setIsBatteryOpen(!isBatteryOpen); setIsStartOpen(false); }}
            className={`flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/80 text-[11px] font-mono font-bold transition-all cursor-pointer ${
              batteryLevel <= 20 ? 'border-red-500/80 text-red-400 animate-bounce shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-slate-300'
            }`}
            title="MalayaliOS Battery Status"
          >
            <span className="text-sm">{getBatteryIcon()}</span>
            <span>{batteryLevel}%</span>
          </button>

          {/* Live Clock */}
          <div className="bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-right leading-tight font-mono">
            <div className="font-bold text-slate-200 text-xs">{timeStr}</div>
            <div className="text-[9px] text-slate-500">{dateStr}</div>
          </div>
        </div>
      </div>
    </>
  );
};
