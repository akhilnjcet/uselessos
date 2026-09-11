import React from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Moon, Star } from 'lucide-react';

export const NightSkyApp = () => {
  const { activeEffects, toggleEffect, playSound } = useOS();

  const handleToggleNight = () => {
    playSound('click');
    const nextNight = !activeEffects.night;
    toggleEffect('night', nextNight);
    if (nextNight) {
      comedyAudio.play('night');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 text-center select-none overflow-hidden justify-between border border-indigo-900/60">
      {/* Header */}
      <div className="space-y-2 max-w-md mx-auto pt-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 text-indigo-400 flex items-center justify-center text-3xl mx-auto shadow-2xl animate-pulse">
          🌌
        </div>
        <h2 className="text-2xl font-black text-indigo-400 tracking-wider">
          3D NIGHT SKY & STARS
        </h2>
        <p className="text-xs text-slate-400">
          Transforms MalayaliOS into a 3D parallax night sky with glowing moon & starfield.
        </p>
      </div>

      {/* Main Controls */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        <button
          onClick={handleToggleNight}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all border ${
            activeEffects.night
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-indigo-500/30'
              : 'bg-slate-900 hover:bg-slate-800 text-indigo-400 border-slate-700'
          }`}
        >
          <Moon className="w-5 h-5" />
          <span>{activeEffects.night ? 'RETURN TO DAYTIME' : 'ACTIVATE 3D NIGHT SKY'}</span>
        </button>

        <p className="text-xs text-indigo-200/80 font-mono italic">
          “ശുഭ രാത്രി... പക്ഷേ ഉറങ്ങണ്ട.”
        </p>
      </div>

      <div className="text-[10px] text-slate-600 font-mono pb-2">
        MalayaliOS 3D Starfield Engine
      </div>
    </div>
  );
};
