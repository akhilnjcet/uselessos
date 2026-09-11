import React from 'react';
import { useOS } from '../context/OSContext';
import { RefreshCw, FolderPlus, Image, ArrowUpDown, Laugh, HelpCircle } from 'lucide-react';

export const ContextMenu = ({ x, y, onClose, onAddCustomFolder }) => {
  const { playSound, addNotification, setWallpaper, wallpaper, openApp } = useOS();

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

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-2xl z-[9800] py-1.5 w-52 text-xs font-sans select-none animate-fadeIn border-amber-500/30"
      style={{ left: `${x}px`, top: `${y}px` }}
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

      <button
        onClick={() => { playSound('click'); addNotification('Sorted', 'Icons sorted by uselessness.', '🗂️'); onClose(); }}
        className="w-full px-3 py-2 text-left hover:bg-slate-800/90 text-slate-200 flex items-center gap-2.5 cursor-pointer"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-purple-400" />
        <span>Sort Icons</span>
      </button>

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
