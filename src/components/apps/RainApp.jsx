import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { CloudRain, CloudLightning, Wind, Sun } from 'lucide-react';

export const RainApp = () => {
  const { activeEffects, toggleEffect, stopEffect, playSound } = useOS();
  const [includeWind, setIncludeWind] = useState(activeEffects.wind);
  const [includeThunder, setIncludeThunder] = useState(activeEffects.thunder);

  const handleToggleRain = () => {
    playSound('click');
    if (activeEffects.rain) {
      stopEffect('rain');
      stopEffect('thunder');
      // Show rainbow after rain ends
      toggleEffect('rainbow', true);
      comedyAudio.play('rainbow');
    } else {
      toggleEffect('rain', true);
      comedyAudio.play('rain1');
    }
  };

  const handleToggleWind = () => {
    playSound('click');
    const nextWind = !includeWind;
    setIncludeWind(nextWind);
    toggleEffect('wind', nextWind);
    if (nextWind) comedyAudio.play('wind');
  };

  const handleToggleThunder = () => {
    playSound('click');
    const nextThunder = !includeThunder;
    setIncludeThunder(nextThunder);
    toggleEffect('thunder', nextThunder);
    if (nextThunder) comedyAudio.play('thunder1');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 text-center select-none overflow-hidden justify-between border border-blue-900/60">
      {/* Header */}
      <div className="space-y-2 max-w-md mx-auto pt-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 flex items-center justify-center text-3xl mx-auto shadow-2xl animate-pulse">
          🌧️
        </div>
        <h2 className="text-2xl font-black text-blue-400 tracking-wider">
          KERALA MONSOON RAIN
        </h2>
        <p className="text-xs text-slate-400">
          Transforms MalayaliOS into a heavy 3D Kerala monsoon environment with rain particles & storm effects.
        </p>
      </div>

      {/* Main Controls */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        <button
          onClick={handleToggleRain}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all border ${
            activeEffects.rain
              ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-blue-500/30'
              : 'bg-slate-900 hover:bg-slate-800 text-blue-400 border-slate-700'
          }`}
        >
          <CloudRain className="w-5 h-5" />
          <span>{activeEffects.rain ? 'STOP MONSOON RAIN' : 'START 3D MONSOON RAIN'}</span>
        </button>

        {/* Rain Enhancements */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleToggleWind}
            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              includeWind
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>🌪️ Wind Effect</span>
          </button>

          <button
            onClick={handleToggleThunder}
            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              includeThunder
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <CloudLightning className="w-4 h-4" />
            <span>🌩️ Thunder Flash</span>
          </button>
        </div>
      </div>

      <div className="text-[10px] text-slate-600 font-mono pb-2">
        MalayaliOS 3D Weather System
      </div>
    </div>
  );
};
