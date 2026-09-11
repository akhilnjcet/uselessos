import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Activity, Play, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EarthquakeApp = () => {
  const { activateEarthquake, stopEffect, playSound } = useOS();
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleStart = () => {
    playSound('click');
    setIsRunning(true);
    setIsDone(false);
    comedyAudio.play('earthquake1');

    // Level 1 -> 2 -> 3 -> 4 Chaos -> Stop
    setStage(1);
    activateEarthquake(1);

    setTimeout(() => {
      setStage(2);
      activateEarthquake(2);
    }, 2000);

    setTimeout(() => {
      setStage(3);
      activateEarthquake(3);
      comedyAudio.play('earthquake2');
    }, 4500);

    setTimeout(() => {
      setStage(4);
      activateEarthquake(4); // CHAOS STAGE
    }, 7500);

    setTimeout(() => {
      setStage(0);
      setIsRunning(false);
      setIsDone(true);
      stopEffect('earthquake');
    }, 11500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 text-center select-none overflow-hidden justify-between border border-amber-900/60">
      {/* Header */}
      <div className="space-y-2 max-w-md mx-auto pt-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-2xl animate-bounce">
          🌍
        </div>
        <h2 className="text-2xl font-black text-amber-400 tracking-wider">
          EARTHQUAKE SIMULATOR
        </h2>
        <p className="text-xs text-slate-400">
          Simulates realistic 3D seismic vibrations across the entire MalayaliOS environment.
        </p>
      </div>

      {/* Main Interactive Container */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        {!isRunning && !isDone && (
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Ready for Seismic Activity?</span>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <Play className="w-4 h-4 fill-current" /> START EARTHQUAKE
            </button>
          </div>
        )}

        {isRunning && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/60 space-y-3 backdrop-blur-md shadow-2xl animate-pulse">
            <Activity className="w-10 h-10 text-amber-400 mx-auto animate-spin" />
            <h3 className="text-xl font-black text-amber-400">
              {stage === 1 && 'LEVEL 1: Small Vibration'}
              {stage === 2 && 'LEVEL 2: Medium Shaking'}
              {stage === 3 && 'LEVEL 3: Strong Seismic Activity'}
              {stage === 4 && '💥 LEVEL 4: TOTAL CHAOS'}
            </h3>
            <p className="text-xs text-amber-200/80 font-mono italic">
              “എടാ... ഭൂമി കുലുങ്ങുന്നുണ്ടല്ലോ!”
            </p>
          </div>
        )}

        {isDone && (
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/60 space-y-2 backdrop-blur-md shadow-2xl animate-fadeIn">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-400">
              🌍 Earthquake ended.
            </h3>
            <p className="text-xs text-slate-300 font-semibold italic">
              “നമ്മൾ രക്ഷപ്പെട്ടു.”
            </p>
            <button
              onClick={handleStart}
              className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl cursor-pointer"
            >
              Run Again
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-600 font-mono pb-2">
        MalayaliOS 3D Environmental Engine
      </div>
    </div>
  );
};
