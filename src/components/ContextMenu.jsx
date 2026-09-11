import React from 'react';
import { useOS } from '../context/OSContext';
import {
  RefreshCw,
  FolderPlus,
  Image,
  ArrowUpDown,
  Laugh,
  HelpCircle,
  LayoutGrid,
  Layers,
  SortAsc,
  Minimize2
} from 'lucide-react';

export const ContextMenu = ({
  x,
  y,
  onClose,
  onAddCustomFolder,
  onSortShortcutsByName,
  onSortShortcutsByCategory,
  onSortShortcutsByChaos,
  onResetShortcuts
}) => {
  const {
    playSound,
    addNotification,
    setWallpaper,
    wallpaper,
    openApp,
    windows,
    cascadeWindows,
    tileWindows,
    sortWindowsByName,
    minimizeAllWindows
  } = useOS();

  const handleRefresh = () => {
    playSound('click');
    addNotification('Refresh', 'വീണ്ടും Refresh ചെയ്തത് കൊണ്ട് ഒന്നും മാറാൻ പോകുന്നില്ല! ☕', '🔄');
    onClose();
  };

  const handleNewFolder = () => {
    playSound('click');
    if (onAddCustomFolder) {
      onAddCustomFolder();
    }
    addNotification('New Folder', 'രഹസ്യ രേഖകൾ folder created.', '📁');
    onClose();
  };

  const handleChangeWallpaper = () => {
    playSound('click');
    const wallpappers = ['tea_stall', 'rainy_kerala', 'sunset', 'cyber_kerala'];
    const nextWp = wallpappers[(wallpappers.indexOf(wallpaper) + 1) % wallpappers.length];
    setWallpaper(nextWp);
    addNotification('Wallpaper Changed', `Switched to ${nextWp}`, '🖼️');
    onClose();
  };

  const handleWhyRightClick = () => {
    playSound('click');
    alert('“Exactly.”');
    onClose();
  };

  const hasWindows = windows.length > 0;
  const menuHeight = hasWindows ? 480 : 360;

  const posX = Math.max(10, Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 800) - 230));
  const posY = Math.max(10, Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 600) - menuHeight));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-2xl z-[9800] py-1.5 w-56 text-xs font-sans select-none animate-fadeIn border-amber-500/30 max-h-[90vh] overflow-y-auto custom-scrollbar"
      style={{ left: `${posX}px`, top: `${posY}px` }}
    >
      <button
        onClick={handleRefresh}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
        <span>Refresh</span>
      </button>

      <button
        onClick={handleNewFolder}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
        <span>New Folder</span>
      </button>

      <button
        onClick={handleChangeWallpaper}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <Image className="w-3.5 h-3.5 text-blue-400" />
        <span>Change Wallpaper</span>
      </button>

      {/* App Shortcuts Sorting Section */}
      <div className="my-1 border-t border-slate-800" />
      <div className="px-3 py-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
        Sort Desktop Shortcuts
      </div>

      <button
        onClick={() => {
          if (onSortShortcutsByName) onSortShortcutsByName();
          onClose();
        }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <SortAsc className="w-3.5 h-3.5 text-purple-400" />
        <span>Sort by Name (A-Z) 🔤</span>
      </button>

      <button
        onClick={() => {
          if (onSortShortcutsByCategory) onSortShortcutsByCategory();
          onClose();
        }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
        <span>Sort by Category 📁</span>
      </button>

      <button
        onClick={() => {
          if (onSortShortcutsByChaos) onSortShortcutsByChaos();
          onClose();
        }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <Laugh className="w-3.5 h-3.5 text-amber-400" />
        <span>Chaos Shuffle (Uselessness) 🤣</span>
      </button>

      <button
        onClick={() => {
          if (onResetShortcuts) onResetShortcuts();
          onClose();
        }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-300 flex items-center gap-2.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
        <span>Reset Default Layout 🔄</span>
      </button>

      {/* App Window Layout & Sorting Options */}
      {hasWindows && (
        <>
          <div className="my-1 border-t border-slate-800" />
          <div className="px-3 py-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
            App Window Layout
          </div>

          <button
            onClick={() => { cascadeWindows(); onClose(); }}
            className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cascade Windows 📐</span>
          </button>

          <button
            onClick={() => { tileWindows(); onClose(); }}
            className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tile Side-by-Side 🧩</span>
          </button>

          <button
            onClick={() => { sortWindowsByName(); onClose(); }}
            className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
          >
            <SortAsc className="w-3.5 h-3.5 text-purple-400" />
            <span>Sort Windows by Title 🔤</span>
          </button>

          <button
            onClick={() => { minimizeAllWindows(); onClose(); }}
            className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Minimize All / Show Desktop 🧹</span>
          </button>
        </>
      )}

      <div className="my-1 border-t border-slate-800" />

      <button
        onClick={() => { openApp('trollCenter', {}, '🤣 Troll Center', '🤣'); onClose(); }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <Laugh className="w-3.5 h-3.5 text-amber-500" />
        <span>Open Comedy</span>
      </button>

      <button
        onClick={handleWhyRightClick}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-amber-400 font-bold flex items-center gap-2.5 cursor-pointer"
      >
        <HelpCircle className="w-3.5 h-3.5 text-red-400" />
        <span>Why did I right-click?</span>
      </button>
    </div>
  );
};
