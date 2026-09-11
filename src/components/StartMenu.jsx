import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { comedyAudio } from '../utils/comedyAudio';
import { Power, Search } from 'lucide-react';

export const StartMenu = ({ onClose }) => {
  const { characters, openApp, playSound, setIsShutdown } = useOS();
  const [search, setSearch] = useState('');
  const [showShutdownConfirm, setShowShutdownConfirm] = useState(false);

  const mainApps = [
    { type: 'trollCenter', title: '🤣 Troll Center', icon: '🤣', desc: 'Central Troll Database' },
    { type: 'chaaya', title: '☕ Chaaya App', icon: '☕', desc: '100% Useless Tea Stall' },
    { type: 'uselessAI', title: '🧠 Useless AI', icon: '🧠', desc: 'Sarcastic Malayalam AI' },
    { type: 'nothing', title: '🗑️ Nothing', icon: '🗑️', desc: 'Does Absolutely Nothing' },
    { type: 'paniPaali', title: '💀 Pani Paali', icon: '💀', desc: 'Fake OS Error Center' },
    { type: 'fileManager', title: '📁 My Files', icon: '📁', desc: 'Exam Notes & Secret Folders' },
    { type: 'browser', title: '🌐 Naatile Browser', icon: '🌐', desc: 'Absurd Search Engine' },
    { type: 'whatsapp', title: '📱 WhatsApp Group', icon: '📱', desc: 'കുടുംബശ്രീ & നാട്ടുകാർ' },
    { type: 'earthquake', title: '🌍 Earthquake', icon: '🌍', desc: 'Earthquake Simulator' },
    { type: 'rain', title: '🌧️ Monsoon Rain', icon: '🌧️', desc: 'Kerala Monsoon Rain' },
    { type: 'nightSky', title: '🌌 Night Sky', icon: '🌌', desc: '3D Starfield & Moon' },
    { type: 'chaosMode', title: '💥 Chaos Mode', icon: '💥', desc: 'Random Nature Events' },
    { type: 'environment', title: '🌍 Environment', icon: '🌍', desc: 'Nature Control Panel' },
    { type: 'commonSense', title: '🧠 Common Sense', icon: '🧠', desc: 'Search for Common Sense' },
    { type: 'findMyCharger', title: '🔌 Find My Charger', icon: '🔌', desc: 'Charger Radar Search' },
    { type: 'ammavanCall', title: '📞 Ammavan Call', icon: '📞', desc: 'Incoming Comedy Call' },
    { type: 'computerCleaner', title: '🧹 Cleaner', icon: '🧹', desc: 'Junk & Meme Cleaner' },
    { type: 'astroTalk', title: '🔮 Astro Talk', icon: '🔮', desc: 'Malayalam Comedy Astrology' },
    { type: 'birdHunt', title: '🦅 Bird Hunt', icon: '🦅', desc: 'AI Hand Gesture Shooting Game' },
    { type: 'settings', title: '⚙️ Settings', icon: '⚙️', desc: 'Themes & Playlist Config' }
  ];

  const filteredApps = mainApps.filter((app) =>
    app.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenApp = (appType, props = {}, title = 'Application', icon = '💻') => {
    openApp(appType, props, title, icon);
    onClose();
  };

  const handleShutdownConfirm = () => {
    playSound('shutdown');
    comedyAudio.play('shutdown');
    setShowShutdownConfirm(false);
    onClose();

    // Trigger fake shutdown screen
    setTimeout(() => {
      setIsShutdown(true);
    }, 600);
  };

  return (
    <div className="fixed bottom-14 left-3 w-80 sm:w-96 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-[9500] p-4 flex flex-col gap-4 font-sans select-none animate-fadeIn border-amber-500/30">
      {/* User Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center font-bold text-slate-950 shadow-lg text-lg">
            👳‍♂️
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">മലയാളി (Admin)</h3>
            <p className="text-[10px] text-amber-400 font-mono">
              UselessOS Premium License
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowShutdownConfirm(true)}
          className="p-2 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-xl border border-red-800/60 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Shutdown OS"
        >
          <Power className="w-4 h-4" />
          <span>Shut Down</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="സെർച്ച് ചെയ്യ്... (e.g. Chaaya, AI)"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Comedy Character Apps Section */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest px-1">
          😂 Comedy Character Apps
        </span>
        <div className="grid grid-cols-2 gap-2">
          {characters.map((char) => (
            <button
              key={char.id}
              onClick={() => handleOpenApp('character', { characterId: char.id }, `😂 ${char.name}`, char.icon)}
              className="p-2.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
                {char.icon}
              </div>
              <div className="truncate">
                <h4 className="font-bold text-xs text-slate-200 group-hover:text-amber-400 truncate">
                  {char.name}
                </h4>
                <p className="text-[9px] text-slate-500 truncate">
                  {char.catchphrase}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
          📱 Most Useless System Apps
        </span>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
          {filteredApps.map((app, idx) => (
            <button
              key={idx}
              onClick={() => handleOpenApp(app.type, {}, app.title, app.icon)}
              className="p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl flex flex-col items-center text-center gap-1 transition-all cursor-pointer group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {app.icon}
              </span>
              <span className="font-bold text-[10px] text-slate-300 group-hover:text-amber-300 truncate w-full">
                {app.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
        UselessOS™ • 100% Comedy Guaranteed
      </div>

      {/* Shutdown Confirmation Dialog */}
      {showShutdownConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">
              Are you sure you want to shut down UselessOS?
            </h3>
            <p className="text-xs text-amber-300 font-medium italic">
              “ഇത്രയും നേരം ചുമ്മാ ഇരുന്നിട്ട് ഇപ്പോ shutdown ആണോ?”
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleShutdownConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Shut Down
              </button>
              <button
                onClick={() => setShowShutdownConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
