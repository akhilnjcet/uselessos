import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { MessageSquare, Mic, Send, Phone, Video, CheckCheck } from 'lucide-react';

const INITIAL_MESSAGES = [
  { sender: 'അമ്മാവൻ (Gulf)', text: 'Good Morning എല്ലാ കൂട്ടുകാർക്കും 🌹🌺🌸', time: '07:30 AM' },
  { sender: 'ഷാജി (Union)', text: 'ഇന്ന് വൈകുന്നേരം ചായക്കടയിൽ ഒരു അടിയന്തര യോഗം ഉണ്ട്.', time: '08:15 AM' },
  { sender: 'അമ്മ', text: 'ഫോൺ മാറ്റി വെച്ചിട്ട് പോയി പഠിക്കാൻ നോക്ക്!', time: '09:00 AM' },
  { sender: 'വിജയൻ', text: 'ദാസാ... നീ അവിടെ ഉണ്ടോ?', time: '09:45 AM' },
  { sender: 'മണവാളൻ', text: 'ഇവിടെ ആർക്കും ഒന്നും തോന്നരുത്... ബിസിനസ്സ് പച്ചപിടിക്കുന്നില്ല!', time: '10:30 AM' }
];

export const WhatsAppApp = () => {
  const { playSound } = useOS();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    playSound('click');
    const newMsg = {
      sender: 'You',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Automated troll reply
    setTimeout(() => {
      const replies = [
        'അതിന് ഇവിടെ ആര് ചോദിച്ചു?',
        'ഈ മെസ്സേജ് ഇവിടെ അയക്കണ്ട കാര്യം എന്താ?',
        'നിന്റെ വക വീണ്ടും ഒരു ബിൽഡ് തകർച്ച!',
        'ചായ കുടിച്ചിട്ട് സംസാരിക്കാം.'
      ];
      const replyMsg = {
        sender: 'നാട്ടുകാർ (Group)',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, replyMsg]);
      playSound('notification');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden border border-emerald-900/40">
      {/* Header */}
      <div className="bg-emerald-950 p-3.5 border-b border-emerald-900 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black">
            👥
          </div>
          <div>
            <h2 className="text-sm font-bold text-emerald-300">
              കുടുംബശ്രീ & നാട്ടുകാർ (42 Members)
            </h2>
            <p className="text-[10px] text-emerald-400/80">
              അമ്മാവൻ, ഷാജി, മണവാളൻ, അമ്മ +38 others
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <Video className="w-4 h-4 cursor-pointer" />
          <Phone className="w-4 h-4 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[80%] ${
              m.sender === 'You' ? 'ml-auto items-end' : 'items-start'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-400 px-1">
              {m.sender}
            </span>
            <div
              className={`p-3 rounded-xl text-xs shadow-md space-y-1 ${
                m.sender === 'You'
                  ? 'bg-emerald-700 text-slate-100 rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}
            >
              <p>{m.text}</p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-slate-300">
                <span>{m.time}</span>
                {m.sender === 'You' && <CheckCheck className="w-3 h-3 text-cyan-300" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="മെസ്സേജ് അയക്കുക..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
