import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Plug, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export const FindMyChargerApp = () => {
  const { playSound, addNotification } = useOS();
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [inHandSuccess, setInHandSuccess] = useState(false);

  const locations = [
    { name: 'Bedroom', searched: true, found: false },
    { name: 'Table', searched: true, found: false },
    { name: 'Bag', searched: true, found: false },
    { name: 'Kitchen', searched: true, found: false },
    { name: 'Under pillow', searched: true, found: false },
    { name: 'Tea shop', searched: true, found: false }
  ];

  const handleStartSearch = () => {
    setIsSearching(true);
    setSearched(false);
    setInHandSuccess(false);
    playSound('click');

    setTimeout(() => {
      setIsSearching(false);
      setSearched(true);
      comedyAudio.play('chargerNotFound');
      addNotification('🔌 Find My Charger', 'Charger കണ്ടെത്താനായില്ല. (Charger not found)', '❌');
    }, 2000);
  };

  const handleSearchAgain = () => {
    playSound('click');
    if (Math.random() < 0.5) {
      setInHandSuccess(true);
      comedyAudio.play('chargerInHand');
      addNotification('🔌 Charger Found!', 'ചാർജർ കൈയിൽ തന്നെയുണ്ട്! 😂', '⚡');
    } else {
      handleStartSearch();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto custom-scrollbar select-none space-y-5">
      <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Plug className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">🔌 Find My Charger</h2>
          <p className="text-xs text-slate-400">MalayaliOS Emergency Charger Search Radar</p>
        </div>
      </div>

      {!searched && !isSearching && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs text-slate-400 max-w-xs">
            Lost your phone charger? MalayaliOS deep-scan will locate it.
          </p>
          <button
            onClick={handleStartSearch}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
          >
            START CHARGER RADAR
          </button>
        </div>
      )}

      {isSearching && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-amber-300">Searching for charger...</p>
        </div>
      )}

      {searched && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              SEARCH LOCATIONS STATUS
            </span>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-950 rounded-xl text-xs border border-slate-800">
                  <span className="text-slate-300">{loc.name}</span>
                  <XCircle className="w-4 h-4 text-red-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center p-4 bg-red-950/40 border border-red-800/60 rounded-2xl space-y-1">
            <h4 className="text-sm font-bold text-red-400">
              {inHandSuccess ? '⚡ Charger Found!' : '❌ Charger കണ്ടെത്താനായില്ല'}
            </h4>
            <p className="text-xs text-amber-300 font-bold italic">
              {inHandSuccess ? '“ചാർജർ കൈയിൽ തന്നെയുണ്ട്!”' : '“വീട്ടുകാരോട് ചോദിച്ചു നോക്ക്.”'}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSearchAgain}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> SEARCH AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
