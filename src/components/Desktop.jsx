import React, { useState, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { ContextMenu } from './ContextMenu';
import { NotificationCenter } from './NotificationCenter';
import { ShutdownScreen } from './ShutdownScreen';
import { Nature3DCanvas } from './Nature3DCanvas';
import { Sparkles, ShieldAlert } from 'lucide-react';

export const Desktop = () => {
  const {
    isShutdown,
    windows,
    characters,
    openApp,
    wallpaper,
    addNotification,
    playSound,
    earthquakeLevel,
    cinematicMode,
    isRamFrozen,
    isOverheating,
    cpuTemp,
    isCctvActive
  } = useOS();

  const [contextMenu, setContextMenu] = useState(null);
  const [customFolders, setCustomFolders] = useState([]);
  const [productivityAlert, setProductivityAlert] = useState(false);

  // Tired Mouse Tracker
  useEffect(() => {
    let moveCount = 0;
    let lastAlertTime = 0;

    const handleMouseMove = () => {
      moveCount++;
      const now = Date.now();
      if (moveCount > 80 && now - lastAlertTime > 15000) {
        lastAlertTime = now;
        moveCount = 0;
        if (Math.random() < 0.5) {
          addNotification('🖱️ Tired Mouse', '🖱️ Mouse Health: 20% (“കുറച്ച് പതുക്കെ ഓടിക്കെടാ.”)', '🖱️');
        } else {
          addNotification('🏎️ Formula 1 Mouse', '“Formula 1 ആണോ കളിക്കുന്നത്?” 😂', '🏎️');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [addNotification]);

  // Close context menu on click anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Background Productivity Detector Ticker
  useEffect(() => {
    const timer = setTimeout(() => {
      const triggerProductivity = () => {
        setProductivityAlert(true);
        playSound('notification');
        setTimeout(() => setProductivityAlert(false), 4000);
      };
      const interval = setInterval(() => {
        if (Math.random() > 0.5) {
          triggerProductivity();
        }
      }, 60000);
      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleAddCustomFolder = () => {
    const name = `രഹസ്യ രേഖകൾ (${customFolders.length + 1})`;
    setCustomFolders((prev) => [...prev, name]);
  };

  // System App Icons Configuration
  const systemApps = [
    { type: 'trollCenter', title: 'Troll Center', icon: '🤣', bg: 'from-amber-500/80 to-red-500/80' },
    { type: 'chaaya', title: 'Chaaya', icon: '☕', bg: 'from-amber-600/80 to-amber-800/80' },
    { type: 'uselessAI', title: 'Useless AI', icon: '🧠', bg: 'from-purple-600/80 to-indigo-600/80' },
    { type: 'nothing', title: 'Nothing', icon: '🗑️', bg: 'from-slate-700/80 to-slate-900/80' },
    { type: 'paniPaali', title: 'Pani Paali', icon: '💀', bg: 'from-red-600/80 to-slate-900/80' },
    { type: 'fileManager', title: 'My Files', icon: '📁', bg: 'from-blue-600/80 to-cyan-600/80' },
    { type: 'browser', title: 'Naatile Browser', icon: '🌐', bg: 'from-emerald-600/80 to-teal-700/80' },
    { type: 'whatsapp', title: 'WhatsApp', icon: '📱', bg: 'from-emerald-500/80 to-green-600/80' },
    { type: 'earthquake', title: 'Earthquake', icon: '🌍', bg: 'from-amber-700/80 to-red-800/80' },
    { type: 'rain', title: 'Monsoon Rain', icon: '🌧️', bg: 'from-cyan-700/80 to-blue-900/80' },
    { type: 'nightSky', title: 'Night Sky', icon: '🌌', bg: 'from-indigo-900/80 to-purple-950/80' },
    { type: 'chaosMode', title: 'Chaos Mode', icon: '💥', bg: 'from-red-600/80 to-purple-800/80' },
    { type: 'environment', title: 'Environment', icon: '🌍', bg: 'from-emerald-700/80 to-teal-900/80' },
    { type: 'commonSense', title: 'Common Sense', icon: '🧠', bg: 'from-purple-700/80 to-pink-900/80' },
    { type: 'findMyCharger', title: 'Find My Charger', icon: '🔌', bg: 'from-amber-600/80 to-orange-800/80' },
    { type: 'ammavanCall', title: 'Ammavan Call', icon: '📞', bg: 'from-green-700/80 to-emerald-900/80' },
    { type: 'computerCleaner', title: 'Cleaner', icon: '🧹', bg: 'from-cyan-600/80 to-teal-800/80' },
    { type: 'astroTalk', title: 'Astro Talk', icon: '🔮', bg: 'from-purple-800/80 to-indigo-900/80' },
    { type: 'birdHunt', title: 'Bird Hunt', icon: '🦅', bg: 'from-sky-600/80 to-teal-700/80' },
    { type: 'settings', title: 'Settings', icon: '⚙️', bg: 'from-slate-600/80 to-slate-800/80' }
  ];

  // Dynamic Wallpaper Styling
  const getWallpaperStyle = () => {
    switch (wallpaper) {
      case 'rainy_kerala':
        return {
          background: 'radial-gradient(ellipse at top, #0f766e, #020617)'
        };
      case 'sunset':
        return {
          background: 'radial-gradient(ellipse at top, #7c2d12, #020617)'
        };
      case 'cyber_kerala':
        return {
          background: 'radial-gradient(ellipse at top, #581c87, #020617)'
        };
      case 'custom_chaaya':
      case 'tea_stall':
      default:
        return {
          backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.15), rgba(2, 6, 23, 0.35)), url('/wallpaper.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
    }
  };

  if (isShutdown) {
    return <ShutdownScreen />;
  }

  const getShakeClass = () => {
    if (!earthquakeLevel || earthquakeLevel === 0) return '';
    return `shake-lvl-${earthquakeLevel}`;
  };

  return (
    <div
      onContextMenu={handleRightClick}
      className={`fixed inset-0 select-none overflow-hidden font-sans transition-all duration-700 ${getShakeClass()}`}
      style={getWallpaperStyle()}
    >
      {/* 3D WebGL Nature & Chaos Environment Canvas */}
      <Nature3DCanvas />

      {/* Subtle overlay for icon readability when using image wallpaper */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none z-[1]" />

      {/* Desktop Icons Grid Container */}
      <div className="p-3 sm:p-6 pt-10 sm:pt-14 flex flex-wrap content-start max-h-[calc(100vh-56px)] overflow-y-auto custom-scrollbar gap-3 sm:gap-6 z-10 relative">
        {/* 1. Comedy Character Icons */}
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => openApp('character', { characterId: char.id }, `😂 ${char.name}`, char.icon)}
            className="group w-20 sm:w-24 p-2 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer hover:bg-black/30 transition-all duration-200 backdrop-blur-md border border-white/10 hover:border-amber-400/50 shadow-xl"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl group-hover:scale-110 transition-transform border border-white/30"
              style={{ background: char.avatarBg || 'linear-gradient(135deg, #1e293b, #0f172a)' }}
            >
              {char.icon}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight line-clamp-2">
              {char.name}
            </span>
          </div>
        ))}

        {/* 2. System App Icons */}
        {systemApps.map((app, idx) => (
          <div
            key={idx}
            onClick={() => openApp(app.type, {}, app.title, app.icon)}
            className="group w-20 sm:w-24 p-2 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer hover:bg-black/30 transition-all duration-200 backdrop-blur-md border border-white/10 hover:border-amber-400/50 shadow-xl"
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${app.bg} flex items-center justify-center text-2xl sm:text-3xl shadow-xl group-hover:scale-110 transition-transform border border-white/30`}
            >
              {app.icon}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight line-clamp-2">
              {app.title}
            </span>
          </div>
        ))}

        {/* 3. Custom Desktop Folders created via right click */}
        {customFolders.map((folderName, idx) => (
          <div
            key={idx}
            onClick={() => openApp('fileManager', {}, folderName, '📁')}
            className="group w-20 sm:w-24 p-2 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer hover:bg-black/30 transition-all duration-200 backdrop-blur-md border border-white/10"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-600/80 to-yellow-600/80 flex items-center justify-center text-3xl shadow-xl group-hover:scale-110 transition-transform border border-white/30">
              📁
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-white group-hover:text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight line-clamp-2">
              {folderName}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Window Layer */}
      {windows.map((win) => (
        <Window key={win.id} windowData={win} />
      ))}

      {/* Productivity Detector Overlay */}
      {productivityAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-red-950/95 border-2 border-red-500 text-slate-100 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl z-[9950] flex items-center gap-4 animate-bounce">
          <ShieldAlert className="w-8 h-8 text-red-400" />
          <div>
            <h4 className="font-black text-sm text-red-400">
              ⚠️ Productivity Detected!
            </h4>
            <p className="text-xs text-slate-200">
              Destroying productivity... Please open a comedy video immediately.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification Layer */}
      <NotificationCenter />

      {/* Right Click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onAddCustomFolder={handleAddCustomFolder}
        />
      )}

      {/* RAM Panic Freeze Overlay */}
      {isRamFrozen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99999] flex flex-col items-center justify-center text-center p-6 space-y-3 cursor-wait">
          <div className="text-6xl animate-ping">💾</div>
          <h2 className="text-2xl font-black text-red-500 tracking-tight">SYSTEM FROZEN (RAM 100%)</h2>
          <p className="text-sm text-slate-300 font-mono">
            “ഇനി എന്തെങ്കിലും ചെയ്താൽ ഞാൻ പോകും.”
          </p>
        </div>
      )}

      {/* Overheat Heat-wave Visual Distortion Overlay */}
      {isOverheating && (
        <div className="fixed inset-0 pointer-events-none z-[9990] bg-gradient-to-t from-red-900/30 via-orange-600/20 to-transparent mix-blend-color-dodge animate-pulse">
          <div className="absolute top-4 right-4 bg-red-950/90 border border-red-500 px-4 py-2 rounded-xl text-red-400 font-mono font-bold text-xs shadow-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>🔥 OVERHEAT TEMP: {cpuTemp}°C</span>
          </div>
        </div>
      )}

      {/* Someone Is Watching CCTV Camera Overlay */}
      {isCctvActive && (
        <div className="fixed top-3 right-3 z-[9999] bg-slate-900/95 border border-red-500/80 px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce">
          <div className="relative flex items-center justify-center">
            <span className="text-2xl">📹</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[11px] font-bold text-red-400 flex items-center gap-1">
              <span>🔴 REC</span>
              <span className="text-[9px] text-slate-400">CCTV CH-01</span>
            </div>
            <div className="text-[10px] text-slate-200">
              Someone is watching...
            </div>
          </div>
        </div>
      )}

      {/* Bottom Taskbar */}
      <Taskbar />
    </div>
  );
};
