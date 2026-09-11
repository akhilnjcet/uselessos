import React from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Globe, CloudRain, Activity, Wind, CloudLightning, Moon, Sun, Sparkles, Maximize2, Sliders } from 'lucide-react';

export const EnvironmentApp = () => {
  const {
    activeEffects,
    toggleEffect,
    activateEarthquake,
    stopEffect,
    stopAllEffects,
    playSound,
    performanceMode,
    setPerformanceMode,
    voiceAlertsEnabled,
    setVoiceAlertsEnabled,
    comedySoundEffectsEnabled,
    setComedySoundEffectsEnabled,
    triggerDogCrossing,
    triggerCrowEvent,
    triggerKeralaTraffic,
    triggerRamPanic,
    triggerOverheat,
    triggerSomeoneWatching,
    isCctvActive
  } = useOS();

  const envCards = [
    {
      id: 'rain',
      name: '🌧️ Monsoon Rain',
      desc: 'കേരളത്തിൽ മഴ പെയ്യുന്നു. 3D WebGL particle rain drops.',
      active: activeEffects.rain,
      onToggle: () => {
        playSound('click');
        if (activeEffects.rain) {
          stopEffect('rain');
          toggleEffect('rainbow', true);
          comedyAudio.play('rainbow');
        } else {
          toggleEffect('rain', true);
          comedyAudio.play('rain1');
        }
      }
    },
    {
      id: 'earthquake',
      name: '🌍 Earthquake',
      desc: 'ഭൂമി കുലുങ്ങുന്നു. Shakes whole OS desktop & 3D camera.',
      active: activeEffects.earthquake,
      onToggle: () => {
        playSound('click');
        if (activeEffects.earthquake) {
          stopEffect('earthquake');
        } else {
          activateEarthquake(3);
          comedyAudio.play('earthquake1');
        }
      }
    },
    {
      id: 'wind',
      name: '🌪️ Strong Wind',
      desc: 'ശക്തമായ കാറ്റ്. Moves rain & particles horizontally.',
      active: activeEffects.wind,
      onToggle: () => {
        playSound('click');
        const next = !activeEffects.wind;
        toggleEffect('wind', next);
        if (next) comedyAudio.play('wind');
      }
    },
    {
      id: 'thunder',
      name: '🌩️ Lightning & Thunder',
      desc: 'മിന്നലും ഇടിയും. 3D point light flashes & audio.',
      active: activeEffects.thunder,
      onToggle: () => {
        playSound('click');
        const next = !activeEffects.thunder;
        toggleEffect('thunder', next);
        if (next) comedyAudio.play('thunder1');
      }
    },
    {
      id: 'night',
      name: '🌌 3D Night Sky',
      desc: '3D Parallax Starfield & glowing moon mesh.',
      active: activeEffects.night,
      onToggle: () => {
        playSound('click');
        const next = !activeEffects.night;
        toggleEffect('night', next);
        if (next) comedyAudio.play('night');
      }
    },
    {
      id: 'rainbow',
      name: '🌈 3D Rainbow',
      desc: 'മഴവില്ല്. Semi-circular 3D arc after monsoon rain.',
      active: activeEffects.rainbow,
      onToggle: () => {
        playSound('click');
        const next = !activeEffects.rainbow;
        toggleEffect('rainbow', next);
        if (next) comedyAudio.play('rainbow');
      }
    },
    {
      id: 'dogCrossing',
      name: '🐕 3D Dog Crossing',
      desc: '3D animated dog walks across MalayaliOS desktop.',
      active: activeEffects.dogCrossing,
      onToggle: () => {
        playSound('click');
        triggerDogCrossing();
      }
    },
    {
      id: 'traffic',
      name: '🚦 3D Kerala Traffic',
      desc: '3D road, bus, auto-rickshaw & traffic jam.',
      active: activeEffects.keralaTraffic,
      onToggle: () => {
        playSound('click');
        triggerKeralaTraffic();
      }
    },
    {
      id: 'crow',
      name: '🐦 3D Crow Event',
      desc: '3D crow flies across sky and drops a small item.',
      active: activeEffects.crowEvent,
      onToggle: () => {
        playSound('click');
        triggerCrowEvent();
      }
    },
    {
      id: 'ramPanic',
      name: '💾 RAM Panic Simulator',
      desc: 'Simulates RAM 82% → 100% UI freeze & recovery.',
      active: false,
      onToggle: () => {
        playSound('click');
        triggerRamPanic();
      }
    },
    {
      id: 'overheat',
      name: '🌡️ Overheat Mode',
      desc: 'Simulates CPU 45°C → 100°C biriyani heat wave.',
      active: activeEffects.overheat,
      onToggle: () => {
        playSound('click');
        triggerOverheat();
      }
    },
    {
      id: 'someoneWatching',
      name: '👀 Someone Is Watching',
      desc: 'CCTV camera popup alert & 3s "Actually nobody" reveal.',
      active: isCctvActive,
      onToggle: () => {
        playSound('click');
        triggerSomeoneWatching();
      }
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-lg">
            🌍
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Environment Control Panel
            </h2>
            <p className="text-xs text-slate-400">
              Manage 3D WebGL weather, camera shake & environmental chaos effects.
            </p>
          </div>
        </div>

        {/* Cinematic Mode Trigger */}
        <button
          onClick={() => { playSound('click'); toggleEffect('cinematicMode'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg ${
            activeEffects.cinematicMode
              ? 'bg-amber-500 text-slate-950 border border-amber-300'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>⛶ CINEMATIC MODE (ESC)</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
        {/* Environment Mode Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              3D Nature & Weather Modes
            </span>
            <button
              onClick={() => { playSound('click'); stopAllEffects(); }}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
            >
              Stop All Effects
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {envCards.map((card) => (
              <div
                key={card.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 shadow-lg ${
                  card.active
                    ? 'bg-amber-950/60 border-amber-500/80 shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between">
                    <span>{card.name}</span>
                    {card.active && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <button
                  onClick={card.onToggle}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    card.active
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {card.active ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quality & Performance Options */}
        <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4" />
            <span>WebGL 3D Rendering & Audio Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-200">Performance Mode</h4>
                <p className="text-[10px] text-slate-400">Reduced particles for lower specs</p>
              </div>
              <button
                onClick={() => setPerformanceMode(!performanceMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  performanceMode ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {performanceMode ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-200">Weather Sounds</h4>
                <p className="text-[10px] text-slate-400">Rain & thunder ambient audio</p>
              </div>
              <button
                onClick={() => setComedySoundEffectsEnabled(!comedySoundEffectsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  comedySoundEffectsEnabled ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {comedySoundEffectsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-200">Comedy Dialogues</h4>
                <p className="text-[10px] text-slate-400">Malayalam voice reactions</p>
              </div>
              <button
                onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  voiceAlertsEnabled ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {voiceAlertsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
