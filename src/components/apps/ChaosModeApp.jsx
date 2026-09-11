import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Flame, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ChaosModeApp = () => {
  const {
    activateEarthquake,
    toggleEffect,
    stopAllEffects,
    playSound,
    openApp,
    triggerDogCrossing,
    triggerCrowEvent,
    triggerKeralaTraffic,
    triggerOverheat,
    triggerRamPanic
  } = useOS();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isChaos, setIsChaos] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [currentEvent, setCurrentEvent] = useState('');
  const [isSurvived, setIsSurvived] = useState(false);

  const handleConfirmYes = () => {
    setShowConfirm(false);
    setIsChaos(true);
    setIsSurvived(false);
    setChaosLevel(1);
    playSound('click');
    comedyAudio.play('chaos');

    // Level 1: Rain & Wind
    setCurrentEvent('🌧️ RAIN + 🌪️ WIND');
    toggleEffect('rain', true);
    toggleEffect('wind', true);

    // Level 2: Earthquake & Traffic & Dog Crossing
    setTimeout(() => {
      setChaosLevel(2);
      setCurrentEvent('🌍 EARTHQUAKE + 🚦 TRAFFIC + 🐕 DOG CROSSING');
      activateEarthquake();
      triggerKeralaTraffic();
      triggerDogCrossing();
    }, 4500);

    // Level 3: Thunder & Overheat & Crow & Ammavan Call
    setTimeout(() => {
      setChaosLevel(3);
      setCurrentEvent('🌩️ THUNDER + 🌡️ OVERHEAT + 🐦 CROW + 📞 AMMAVAN');
      toggleEffect('thunder', true);
      triggerOverheat();
      triggerCrowEvent();
      openApp('ammavanCall', {}, '📞 Ammavan Call', '📞');
    }, 9000);

    // End Chaos
    setTimeout(() => {
      stopAllEffects();
      setIsChaos(false);
      setChaosLevel(0);
      setIsSurvived(true);
      comedyAudio.play('startup');
    }, 14000);
  };

  return (
    <div className="h-full flex flex-col bg-red-950 text-slate-100 font-sans p-6 text-center select-none overflow-hidden justify-between border border-red-900">
      {/* Header */}
      <div className="space-y-2 max-w-md mx-auto pt-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center text-3xl mx-auto shadow-2xl animate-bounce">
          💥
        </div>
        <h2 className="text-2xl font-black text-red-400 tracking-wider">
          💥 CHAOS MODE
        </h2>
        <p className="text-xs text-slate-300">
          Randomly activates environmental events until MalayaliOS completely loses control.
        </p>
      </div>

      {/* Main Controls */}
      <div className="my-auto max-w-sm w-full mx-auto space-y-4">
        {!isChaos && !showConfirm && !isSurvived && (
          <button
            onClick={() => { playSound('click'); setShowConfirm(true); }}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-red-400/40 hover:scale-105"
          >
            <Flame className="w-5 h-5 animate-pulse" />
            <span>ACTIVATE TOTAL CHAOS MODE</span>
          </button>
        )}

        {showConfirm && (
          <div className="bg-slate-900/95 p-5 rounded-2xl border border-red-500 space-y-3 shadow-2xl animate-fadeIn">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-lg font-black text-red-400">ARE YOU SURE?</h3>
            <p className="text-xs text-amber-300 font-bold italic">
              “ഇത് click ചെയ്തിട്ട് പിന്നെ എന്നെ കുറ്റം പറയരുത്.”
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleConfirmYes}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                YES
              </button>
              <button
                onClick={() => { playSound('click'); setShowConfirm(false); }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {isChaos && (
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-red-500/60 space-y-3 backdrop-blur-md shadow-2xl animate-pulse">
            <ShieldAlert className="w-10 h-10 text-red-400 mx-auto animate-spin" />
            <h3 className="text-2xl font-black text-amber-400 font-mono">
              CHAOS LEVEL: {chaosLevel}
            </h3>
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
              CURRENT EVENT: {currentEvent}
            </p>
            <p className="text-xs text-slate-300 italic font-mono">
              “എന്തൊക്കെയാ ഇവിടെ നടക്കുന്നത്? System-ന് തന്നെ control ഇല്ല!”
            </p>
          </div>
        )}

        {isSurvived && (
          <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-500/60 space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-black text-emerald-400">System Survived!</h3>
            <p className="text-xs text-slate-300">
              MalayaliOS survived the extreme environmental chaos test.
            </p>
            <button
              onClick={() => setIsSurvived(false)}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-500 font-mono pb-2">
        MalayaliOS Extreme Environmental Testing
      </div>
    </div>
  );
};
