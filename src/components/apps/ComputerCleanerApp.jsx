import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Broom, Sparkles, CheckCircle2, HardDrive } from 'lucide-react';

export const ComputerCleanerApp = () => {
  const { playSound, addNotification } = useOS();
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [progress, setProgress] = useState(0);

  const fakeFiles = [
    'പഴയ screenshots',
    'useless memes',
    'random files',
    'unknown files',
    '47 useless folders'
  ];

  const handleCleanNow = () => {
    setIsCleaning(true);
    setProgress(0);
    playSound('click');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCleaning(false);
          setCleaned(true);
          comedyAudio.play('cleanerCleaned');
          addNotification('🧹 Computer Cleaner', 'Cleaned: 0 bytes. നിന്റെ computer ഇതിനകം clean ആണ്.', '✨');
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto custom-scrollbar select-none space-y-6">
      <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl">
          🧹
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-100">🧹 Computer Cleaner</h2>
          <p className="text-xs text-slate-400">MalayaliOS Ultimate Junk & Meme Optimizer</p>
        </div>
      </div>

      {!cleaned && !isCleaning && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              SCAN RESULTS: 147 USELESS FILES FOUND
            </span>
            <ul className="space-y-1">
              {fakeFiles.map((file, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{file}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleCleanNow}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> CLEAN NOW
            </button>
          </div>
        </div>
      )}

      {isCleaning && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <p className="text-xs font-mono text-cyan-300">Cleaning useless junk... {progress}%</p>
          <div className="w-full max-w-xs bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {cleaned && (
        <div className="space-y-4 text-center animate-fadeIn py-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
            ✨
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-emerald-400">Cleaned: 0 bytes</h3>
            <p className="text-xs text-amber-300 italic font-bold">
              “നിന്റെ computer ഇതിനകം clean ആണ്.”
            </p>
          </div>
          <button
            onClick={() => setCleaned(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};
