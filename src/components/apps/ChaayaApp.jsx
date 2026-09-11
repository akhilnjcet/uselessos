import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Coffee, Zap, Sparkles } from 'lucide-react';

export const ChaayaApp = () => {
  const { playSound, chargeBatteryFull } = useOS();
  const [teaMessage, setTeaMessage] = useState('ചായ കുടിക്കാൻ ഒരുങ്ങിയിരിക്ക്!');
  const [isPouring, setIsPouring] = useState(false);
  const [teaType, setTeaType] = useState('കടുപ്പം');
  const [cupCount, setCupCount] = useState(1);
  const [showChargeDialog, setShowChargeDialog] = useState(true);

  const teaQuotes = [
    "ചായ റെഡി!",
    "ചായ കുടിച്ചിട്ട് പോ.",
    "ആദ്യം ചായ, പിന്നെ coding.",
    "ഇനി ഒരു ചായ കൂടി വേണം.",
    "കടുപ്പത്തിൽ ഒരു ചായ... മനസ്സിന് കുളിർമ!",
    "നാട്ടിലെ ഏറ്റവും മികച്ച ചായക്കട."
  ];

  const handlePourTea = (type) => {
    setIsPouring(true);
    setTeaType(type);
    playSound('tea');

    if (cupCount > 5) {
      comedyAudio.play('chaayaExcess');
    } else {
      comedyAudio.play('chaayaReady');
    }

    setTimeout(() => {
      setIsPouring(false);
      setCupCount((prev) => prev + 1);
      const nextQuote = teaQuotes[Math.floor(Math.random() * teaQuotes.length)];
      setTeaMessage(nextQuote);
    }, 1000);
  };

  const handleChargeYes = () => {
    setIsPouring(true);
    playSound('tea');
    setTeaMessage('ചായ വാങ്ങുന്നു... Energy +100... Full charge! 🔋 100%');
    setShowChargeDialog(false);

    setTimeout(() => {
      chargeBatteryFull();
      setIsPouring(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-amber-950 text-slate-100 font-sans overflow-hidden border border-amber-900/60">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-950 p-5 border-b border-amber-800/80 flex items-center justify-between flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black shadow-xl text-2xl">
            ☕
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300">
              നാട്ടിലെ ചായക്കട™
            </h2>
            <p className="text-xs text-amber-200/80">
              100% Useless Tea Stall & OS Battery Charging Hub
            </p>
          </div>
        </div>
        <div className="bg-amber-900/80 px-3 py-1.5 rounded-lg border border-amber-700 text-xs font-bold text-amber-200">
          Cups Served: {cupCount}
        </div>
      </div>

      {/* Main Display Container */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/40 via-amber-950 to-slate-950">
        
        {/* Dedicated Interaction Box: "ചായ കുടിക്കണോ?" */}
        {showChargeDialog && (
          <div className="bg-amber-900/90 border-2 border-amber-500/60 p-5 rounded-2xl max-w-sm w-full shadow-2xl backdrop-blur-md space-y-3 animate-fadeIn">
            <h3 className="text-lg font-black text-amber-300">
              ☕ ചായ കുടിക്കണോ?
            </h3>
            <p className="text-xs text-amber-100">
              (Drinking tea will instantly boost your battery to 100%!)
            </p>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={handleChargeYes}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4" /> YES (+100 Energy)
              </button>
              <button
                onClick={() => setShowChargeDialog(false)}
                className="px-4 py-2 bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                NO
              </button>
            </div>
          </div>
        )}

        {/* Steam Animation */}
        <div className="relative">
          {isPouring && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              <span className="w-2 h-8 bg-amber-300/40 rounded-full blur-sm animate-bounce" />
              <span className="w-2 h-10 bg-amber-200/30 rounded-full blur-sm animate-bounce delay-100" />
              <span className="w-2 h-6 bg-amber-300/40 rounded-full blur-sm animate-bounce delay-200" />
            </div>
          )}

          {/* Glass Visual */}
          <div className="w-32 h-44 border-4 border-amber-400/80 rounded-b-3xl relative overflow-hidden bg-amber-900/20 backdrop-blur-md shadow-2xl flex flex-col justify-end p-2 border-t-0">
            <div className="absolute -top-2 left-0 right-0 h-4 border-2 border-amber-400/80 rounded-full bg-amber-900/40" />
            
            {/* Liquid Fill */}
            <div
              className="bg-gradient-to-t from-amber-800 via-amber-600 to-amber-500 rounded-b-2xl transition-all duration-700 relative overflow-hidden shadow-inner"
              style={{ height: isPouring ? '90%' : '70%' }}
            >
              {/* Foam Top */}
              <div className="w-full h-3 bg-amber-200/80 rounded-full blur-[1px] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className="space-y-1 max-w-md bg-amber-900/60 p-4 rounded-xl border border-amber-700/60 shadow-xl backdrop-blur-md">
          <h3 className="text-xl font-black text-amber-300 animate-pulse">
            “{teaMessage}”
          </h3>
          <p className="text-xs text-amber-200/70 font-medium">
            Tea Type: <span className="font-bold text-amber-400">{teaType}</span>
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl w-full">
          <button
            onClick={() => handlePourTea('കടുപ്പം')}
            disabled={isPouring}
            className="p-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer border border-amber-400/50"
          >
            ☕ കടുപ്പം
          </button>
          <button
            onClick={() => handlePourTea('ലൈറ്റ്')}
            disabled={isPouring}
            className="p-3 bg-amber-700 hover:bg-amber-600 active:scale-95 text-amber-100 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer border border-amber-500/50"
          >
            🍵 ലൈറ്റ്
          </button>
          <button
            onClick={() => handlePourTea('പഞ്ചസാര കൂടുതൽ')}
            disabled={isPouring}
            className="p-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer border border-amber-300/50"
          >
            🍯 പഞ്ചസാര കൂടുതൽ
          </button>
          <button
            onClick={() => handlePourTea('ഒരു കടി കൂടി')}
            disabled={isPouring}
            className="p-3 bg-amber-800 hover:bg-amber-700 active:scale-95 text-amber-200 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer border border-amber-600/50"
          >
            🍌 ഒരു കടി കൂടി (പരിപ്പുവട)
          </button>
        </div>
      </div>
    </div>
  );
};
