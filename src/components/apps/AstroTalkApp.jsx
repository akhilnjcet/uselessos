import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { comedyAudio } from '../../utils/comedyAudio';
import { Sparkles, MessageSquare, Phone, RefreshCw, CreditCard, Compass, CheckCircle2, User, Clock, MapPin, Calendar, Volume2, VolumeX } from 'lucide-react';

export const AstroTalkApp = () => {
  const { playSound, addNotification } = useOS();
  const [activeTab, setActiveTab] = useState('astrologers'); // astrologers | chat | horoscope | spinner | premium
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);

  // User Profile State
  const [profile, setProfile] = useState({
    name: 'മലയാളി',
    dob: '15/08/1998',
    time: '10:30 AM',
    place: 'Kochi'
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Call Modal State
  const [callModal, setCallModal] = useState({ open: false, status: '' });

  // Spinner State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Premium Payment Modal
  const [paymentModal, setPaymentModal] = useState({ open: false, processing: false, done: false });

  // Voice Toggle
  const [voiceOn, setVoiceOn] = useState(true);

  // Astrologer Profiles
  const [astrologers, setAstrologers] = useState([
    {
      id: 'balan',
      name: '🔮 ജ്യോതിഷൻ ബാലൻ',
      tagline: '20 വർഷത്തെ experience',
      status: '🟢 ONLINE',
      avatar: '👳‍♂️',
      desc: 'ജാതകം കൃത്യമായി ഗണിക്കും. ഭാവി കൃത്യം.'
    },
    {
      id: 'sashi',
      name: '🔮 ശശി ജ്യോത്സ്യൻ',
      tagline: 'നക്ഷത്രം നോക്കും... ചായയും കുടിക്കും',
      status: '🟡 ചായ കുടിക്കാൻ പോയി',
      avatar: '🧔‍♂️',
      desc: 'ചായ കുടിച്ചാലേ ഗ്രഹങ്ങൾ തെളിയൂ.'
    },
    {
      id: 'preman',
      name: '🔮 പ്രേമൻ ജ്യോത്സ്യൻ',
      tagline: 'Love matters specialist',
      status: '🟢 ONLINE',
      avatar: '👨‍🦱',
      desc: 'പ്രണയ കാര്യങ്ങളിൽ 100% ഗ്യാരണ്ടി.'
    },
    {
      id: 'kumaran',
      name: '🔮 കുമാരൻ സ്വാമി',
      tagline: 'Future 100%... approximately',
      status: '🔴 Sleeping',
      avatar: '👴',
      desc: 'ഉറക്കത്തിലാണ് കൂടുതൽ വെളിപാടുകൾ.'
    }
  ]);

  // Dynamic status update timer
  useEffect(() => {
    const interval = setInterval(() => {
      setAstrologers((prev) =>
        prev.map((astro) => {
          if (astro.id === 'sashi') {
            const isOnline = Math.random() > 0.4;
            return {
              ...astro,
              status: isOnline ? '🟢 ONLINE (Back online)' : '🟡 ചായ കുടിക്കാൻ പോയി'
            };
          }
          return astro;
        })
      );
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handle Find My Future submit
  const handleFindFuture = (e) => {
    e.preventDefault();
    playSound('click');
    if (voiceOn) comedyAudio.play('commonSense1');
    addNotification('🔮 Astro Talk', `ജാതകം റെഡി! ${profile.name} നക്ഷത്രഫലം തെളിഞ്ഞു.`, '🔮');
    setActiveTab('horoscope');
  };

  // Start Chat session with selected astrologer
  const handleStartChat = (astro) => {
    playSound('click');
    setSelectedAstrologer(astro);
    setActiveTab('chat');
    setChatMessages([
      { sender: 'astro', text: `നമസ്കാരം ${profile.name}... നിങ്ങളുടെ ജാതകം നോക്കുകയാണ്.` }
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'astro', text: 'ഹ്മ്മ്... കാര്യങ്ങൾ കുറച്ച് complicated ആണ്.' }
      ]);
      setIsTyping(false);
    }, 2500);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'astro', text: 'നിങ്ങളുടെ ജീവിതത്തിൽ ഒരു വലിയ മാറ്റം വരാൻ പോകുന്നു.' }
      ]);
    }, 5500);
  };

  // User sends message in Chat
  const handleSendMessage = (msgText) => {
    const text = msgText || userInput;
    if (!text.trim()) return;

    playSound('click');
    setChatMessages((prev) => [...prev, { sender: 'user', text }]);
    setUserInput('');
    setIsTyping(true);

    const funnyReplies = [
      { text: 'അത് നിങ്ങൾ തന്നെ അറിയണം. 😂', delay: 2000 },
      { text: 'പണം വരാനുള്ള യോഗം കാണുന്നുണ്ട്. പക്ഷേ ആദ്യം ചെലവാകും. 💸', delay: 2500 },
      { text: 'ഫോണിൽ കൂടുതൽ സമയം ചെലവഴിക്കുന്നതായി ഗ്രഹങ്ങൾ പറയുന്നു. 📱', delay: 2200 },
      { text: 'ചായയുമായി നിങ്ങൾക്ക് ഒരു പ്രത്യേക ബന്ധമുണ്ട്. ☕', delay: 1800 },
      { text: 'Computer-ൽ കൂടുതൽ useless applications ഉപയോഗിക്കുന്നു! 💻', delay: 2400 },
      { text: 'വീട്ടിൽ നിന്ന് "എപ്പോഴാണ് ജോലി?" എന്ന ചോദ്യം വരും! 🏠', delay: 2300 }
    ];

    const reply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [...prev, { sender: 'astro', text: reply.text }]);
      if (voiceOn) comedyAudio.play('chaaya');
    }, reply.delay);
  };

  // Handle Call Astrologer
  const handleCallAstrologer = (astro) => {
    playSound('click');
    setCallModal({ open: true, status: 'Connecting...' });

    setTimeout(() => {
      setCallModal({ open: true, status: 'Calling...' });
    }, 1500);

    setTimeout(() => {
      setCallModal({
        open: true,
        status: '🔴 Astrologer is unavailable.\nReason: "ജാതകം നോക്കുന്നതിനിടെ ഉറങ്ങിപ്പോയി."'
      });
      if (voiceOn) comedyAudio.play('ammavanRejected');
    }, 3800);
  };

  // Spin Fortune Wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    playSound('click');
    setIsSpinning(true);
    setSpinResult(null);

    const newRotation = rotation + 1440 + Math.floor(Math.random() * 360);
    setRotation(newRotation);

    const results = [
      '💰 ഇന്ന് പണം കിട്ടും (അല്ലെങ്കിൽ ചെലവാകും).',
      '🍗 ഇന്ന് നല്ല ഭക്ഷണം കിട്ടും (Porotta & Beef).',
      '😴 ഇന്ന് ഉറക്കം കൂടുതലായിരിക്കും.',
      '📱 Phone വിട്ട് മാറാൻ പറ്റില്ല.',
      '😂 നിങ്ങളുടെ ഭാവി ഇപ്പോൾ പറയാൻ പറ്റില്ല.',
      '☕ ചായ കുടിക്കാൻ പോകും.'
    ];

    setTimeout(() => {
      setIsSpinning(false);
      const res = results[Math.floor(Math.random() * results.length)];
      setSpinResult(res);
      addNotification('🔮 Spin Result', res, '🎉');
      if (voiceOn) comedyAudio.play('chaaya');
    }, 3500);
  };

  // Trigger Fake Premium Payment
  const handlePayPremium = () => {
    playSound('click');
    setPaymentModal({ open: true, processing: true, done: false });

    setTimeout(() => {
      setPaymentModal({ open: true, processing: false, done: true });
      if (voiceOn) comedyAudio.play('error1');
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 p-4 border-b border-purple-900/40 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-2xl shadow-xl animate-pulse">
            🔮
          </div>
          <div>
            <h2 className="text-lg font-black text-purple-300 tracking-wide flex items-center gap-2">
              <span>🔮 ASTRO TALK MALAYALAM</span>
            </h2>
            <p className="text-[11px] text-amber-300 italic font-mono">
              “നക്ഷത്രം പറയുന്നത്... പക്ഷേ കുറച്ച് comedy ആയിട്ട് 😂”
            </p>
          </div>
        </div>

        {/* Mute Toggle */}
        <button
          onClick={() => setVoiceOn(!voiceOn)}
          className="p-2 bg-slate-900 border border-slate-800 hover:border-purple-500 rounded-xl text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          {voiceOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          <span className="hidden sm:inline">{voiceOn ? 'Voice On' : 'Voice Off'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
        {[
          { id: 'astrologers', label: '🔮 Consult Astrologers' },
          { id: 'horoscope', label: '🌞 Today\'s Horoscope' },
          { id: 'spinner', label: '🎡 Fortune Spinner' },
          { id: 'premium', label: '💎 Premium Future (₹9999)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { playSound('click'); setActiveTab(tab.id); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar relative">
        {/* ==================================================================== */}
        {/* TAB 1: ASTROLOGERS LIST & PROFILE FORM */}
        {/* ==================================================================== */}
        {activeTab === 'astrologers' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            {/* User Profile Form */}
            <form onSubmit={handleFindFuture} className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-purple-900/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                <User className="w-4 h-4 text-purple-400" />
                <span>നിങ്ങളുടെ ജാതക വിവരങ്ങൾ (USER PROFILE)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Time of Birth</label>
                  <input
                    type="text"
                    value={profile.time}
                    onChange={(e) => setProfile({ ...profile, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Place</label>
                  <input
                    type="text"
                    value={profile.place}
                    onChange={(e) => setProfile({ ...profile, place: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
                >
                  🔮 FIND MY FUTURE
                </button>
              </div>
            </form>

            {/* Astrologers Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                🟢 ONLINE ASTROLOGERS CONSULTATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {astrologers.map((astro) => (
                  <div
                    key={astro.id}
                    className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700 flex items-center justify-center text-2xl shadow-inner">
                          {astro.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                            {astro.name}
                          </h4>
                          <p className="text-[11px] text-amber-300 font-mono">
                            {astro.tagline}
                          </p>
                          <p className="text-[10px] text-slate-400 pt-0.5">
                            {astro.desc}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 bg-slate-950 rounded-full border border-slate-800 font-bold whitespace-nowrap">
                        {astro.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleStartChat(astro)}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> CHAT NOW
                      </button>
                      <button
                        onClick={() => handleCallAstrologer(astro)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center justify-center gap-1"
                        title="Call Astrologer"
                      >
                        <Phone className="w-3.5 h-3.5" /> CALL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: LIVE CHAT VIEW */}
        {/* ==================================================================== */}
        {activeTab === 'chat' && selectedAstrologer && (
          <div className="h-full flex flex-col max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-purple-900/40 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Chat Header */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedAstrologer.avatar}</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{selectedAstrologer.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">🟢 CONSULTATION ACTIVE</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('astrologers')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Back
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-sans leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-xs text-purple-400 font-mono animate-pulse">
                    🔮 {selectedAstrologer.name} is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-2 bg-slate-950/60 border-t border-slate-800/80 flex gap-2 overflow-x-auto custom-scrollbar">
              {[
                'എന്ത് മാറ്റം?',
                'പണം എപ്പോൾ വരും?',
                'എന്റെ ഭാവി എന്താകും?',
                'ലവ് ലൈഫ് എങ്ങനെയാ?'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-purple-300 whitespace-nowrap cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="ചോദ്യം ചോദിക്കൂ... (Ask astrologer)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-purple-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: DAILY HOROSCOPE & LUCKY ITEMS */}
        {/* ==================================================================== */}
        {activeTab === 'horoscope' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            {/* Lucky Items Header Banner */}
            <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 p-4 rounded-2xl border border-purple-500/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>TODAY'S LUCKY ITEMS FOR {profile.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: '🍀 Lucky Number', val: '7' },
                  { label: '☕ Lucky Drink', val: 'Chaya (ചായ)' },
                  { label: '🍛 Lucky Food', val: 'Porotta & Beef' },
                  { label: '🎨 Lucky Colour', val: 'Yellow (മഞ്ഞ)' },
                  { label: '📱 Lucky App', val: 'YouTube' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="block text-[10px] text-slate-400">{item.label}</span>
                    <span className="font-bold text-xs text-purple-300">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zodiac Predictions Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                🌞 12 RASHI MALAYALAM HOROSCOPE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { sign: '♈ Aries (മേടം)', p: 'ഇന്ന് ഒരു പ്രധാന തീരുമാനം എടുക്കും. പിന്നെ അത് മാറ്റും. 😂' },
                  { sign: '♉ Taurus (ഇടവം)', p: 'ഇന്ന് പണം സംരക്ഷിക്കുക. Online shopping ഒഴിവാക്കുക.' },
                  { sign: '♊ Gemini (മിഥുനം)', p: 'ഇന്ന് ഒരാൾ നിങ്ങളോട് സംസാരിക്കും. ആരാണ് എന്ന് ഞങ്ങൾക്കും അറിയില്ല.' },
                  { sign: '♋ Cancer (കർക്കടകം)', p: 'ഫോണിൽ സമയം പോകും. ഗ്രഹങ്ങൾക്ക് പോലും നിർത്താൻ കഴിയില്ല.' },
                  { sign: '♌ Leo (ചിങ്ങം)', p: 'വീട്ടിൽ സമാധാനം വരാൻ ചായ ഉണ്ടാക്കി കൊടുക്കുക.' },
                  { sign: '♍ Virgo (കന്നി)', p: 'ഇന്ന് പണി പാളാനുള്ള സാധ്യത കുറവാണ്. പക്ഷേ ജാഗ്രത വേണം.' }
                ].map((horo, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
                    <h4 className="font-bold text-xs text-amber-400">{horo.sign}</h4>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      “{horo.p}”
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: FORTUNE SPINNER */}
        {/* ==================================================================== */}
        {activeTab === 'spinner' && (
          <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto py-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-purple-300">🔮 SPIN MY FUTURE</h3>
              <p className="text-xs text-slate-400">Click spin to reveal your dramatic Malayalam fortune!</p>
            </div>

            {/* Animated 3D Wheel Mesh SVG */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className="w-56 h-56 rounded-full border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center relative transition-transform duration-[3000ms] ease-out bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 animate-spin-slow" />
                <div className="text-center font-bold text-xs text-amber-300 p-4">
                  💰 🍗 😴 📱 😂 ☕
                </div>
              </div>
              <div className="absolute top-0 text-2xl text-amber-400 -mt-2 animate-bounce">
                ▼
              </div>
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl cursor-pointer transition-all ${
                isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isSpinning ? 'SPINNING...' : '🔮 SPIN MY FUTURE'}
            </button>

            {spinResult && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/60 text-center space-y-2 shadow-2xl animate-bounce">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">FORTUNE REVEALED</span>
                <p className="text-base font-black text-purple-200">
                  {spinResult}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: FAKE PREMIUM FUTURE (₹9999) */}
        {/* ==================================================================== */}
        {activeTab === 'premium' && (
          <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto py-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-4xl shadow-2xl">
              💎
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-amber-400">💎 PREMIUM FUTURE</h3>
              <p className="text-xs text-slate-300">
                Unlock your complete 100% future prediction with secret planetary secrets.
              </p>
              <div className="text-3xl font-black text-emerald-400 font-mono pt-2">
                ₹9999
              </div>
            </div>

            <button
              onClick={handlePayPremium}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> PAY ₹9999 TO UNLOCK
            </button>
          </div>
        )}
      </div>

      {/* Astrologer Call Unavailable Modal */}
      {callModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-purple-500/50 p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl animate-fadeIn">
            <Phone className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-slate-100 whitespace-pre-line">
              {callModal.status}
            </h4>
            <button
              onClick={() => setCallModal({ open: false, status: '' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fake Premium Payment Modal */}
      {paymentModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 border border-amber-500/50 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-fadeIn">
            {paymentModal.processing ? (
              <div className="space-y-3 py-4">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-mono text-amber-300">Processing ₹9999 Payment...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-amber-400">Payment Unnecessary! 😂</h4>
                <p className="text-xs text-slate-300 italic font-mono leading-relaxed">
                  “Future ഇതിനകം complicated ആണ്.”
                </p>
                <button
                  onClick={() => setPaymentModal({ open: false, processing: false, done: false })}
                  className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
