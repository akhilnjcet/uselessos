import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { ABSURD_AI_RESPONSES } from '../../config/trollCategories';
import { comedyAudio } from '../../utils/comedyAudio';
import { Send, BrainCircuit, RefreshCw } from 'lucide-react';

export const UselessAIApp = () => {
  const { playSound } = useOS();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'നമസ്കാരം! ഞാൻ Useless AI. നിന്റെ ആഗ്രഹങ്ങൾ ഒന്നും ഇവിടെ നടപ്പിലാകില്ല.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    playSound('click');
    const userQuery = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setInput('');
    setIsThinking(true);

    const steps = [
      'Thinking…',
      'Thinking more…',
      'Still thinking…',
      'അറിയില്ല.'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        setThinkingStep(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setThinkingStep('');
        setIsThinking(false);

        const responseText =
          ABSURD_AI_RESPONSES[
            Math.floor(Math.random() * ABSURD_AI_RESPONSES.length)
          ];

        setMessages((prev) => [...prev, { sender: 'ai', text: responseText }]);
        playSound('notification');
        comedyAudio.playUselessAI();
      }
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-purple-300">
              🧠 Useless AI v0.0.1
            </h2>
            <p className="text-xs text-slate-400">
              Guaranteed 0% Accuracy • Powered by Pure Troll Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/60">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? '👤' : '🤖'}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-md leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Thinking Overlay Bubble */}
        {isThinking && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
              🤖
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{thinkingStep || 'Thinking...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ഏതെങ്കിലും സംശയം ഉണ്ടെങ്കിൽ ചോദിക്ക്..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
