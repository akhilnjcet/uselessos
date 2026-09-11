import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { PhoneCall, PhoneOff, Phone, UserCheck } from 'lucide-react';

export const AmmavanCallApp = () => {
  const { playSound, addNotification } = useOS();
  const [callState, setCallState] = useState('incoming'); // incoming | ongoing | ended
  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    { text: '“എവിടെയാ പഠിക്കുന്നത്?”', key: 'ammavanQ1' },
    { text: '“ജോലി കിട്ടിയോ?”', key: 'ammavanQ2' },
    { text: '“കല്യാണം നോക്കുന്നില്ലേ?”', key: 'ammavanQ3' },
    { text: '“ശരി... വെച്ചേക്കാം.”', key: 'ammavanQ4' }
  ];

  const handleAnswer = () => {
    playSound('click');
    setCallState('ongoing');
    setCurrentStep(0);
    playStep(0);
  };

  const playStep = (stepIdx) => {
    if (stepIdx < questions.length) {
      const q = questions[stepIdx];
      comedyAudio.play(q.key);
      addNotification('📞 Unknown Ammavan', q.text, '📞');

      setTimeout(() => {
        if (stepIdx + 1 < questions.length) {
          setCurrentStep(stepIdx + 1);
          playStep(stepIdx + 1);
        } else {
          setCallState('ended');
        }
      }, 3500);
    }
  };

  const handleReject = () => {
    playSound('click');
    setCallState('ended');
    comedyAudio.play('ammavanRejected');
    addNotification('📞 Call Rejected', 'അമ്മാവൻ വീണ്ടും വിളിക്കും. 📞', '🚫');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-sans p-6 text-center select-none space-y-6">
      <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center text-5xl shadow-2xl relative">
        👳‍♂️
        {callState === 'incoming' && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full animate-ping" />
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-100">Unknown Ammavan</h2>
        <p className="text-xs text-amber-400 font-mono">
          {callState === 'incoming' && '📞 INCOMING CALL...'}
          {callState === 'ongoing' && '🟢 CALL IN PROGRESS...'}
          {callState === 'ended' && '🔴 CALL ENDED'}
        </p>
      </div>

      {callState === 'incoming' && (
        <div className="flex items-center gap-6 pt-4">
          <button
            onClick={handleAnswer}
            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all animate-bounce"
            title="Answer"
          >
            <Phone className="w-7 h-7" />
          </button>
          <button
            onClick={handleReject}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all"
            title="Reject"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      )}

      {callState === 'ongoing' && (
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 max-w-sm w-full space-y-3 animate-fadeIn">
          <p className="text-xs text-slate-400 font-mono">Ammavan asks:</p>
          <h3 className="text-lg font-black text-amber-300 italic">
            {questions[currentStep]?.text}
          </h3>
        </div>
      )}

      {callState === 'ended' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Call finished. Ammavan is waiting for answers.</p>
          <button
            onClick={() => setCallState('incoming')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
          >
            Call Again
          </button>
        </div>
      )}
    </div>
  );
};
