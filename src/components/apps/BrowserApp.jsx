import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Globe, Search, RefreshCw, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const BrowserApp = () => {
  const { playSound } = useOS();
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const predefinedResults = [
    {
      keywords: ['study', 'exam', 'one day', 'pass'],
      title: 'How to study in one day',
      answer: 'Scientists have confirmed that this is impossible. പോയി ഉറങ്ങാൻ നോക്ക് മോനെ.'
    },
    {
      keywords: ['biriyani', 'food', 'best'],
      title: 'Best biriyani in Kerala?',
      answer: 'Depends on who is paying. ഫ്രീ ആയി കിട്ടുന്ന ഏത് ബിരിയാണിയും ബെസ്റ്റ് ആണ്.'
    },
    {
      keywords: ['job', 'money', 'gulf'],
      title: 'How to get rich quickly in Gulf?',
      answer: 'നാട്ടിൽ തിരിച്ചെത്തി ചായക്കട തുടങ്ങുക.'
    },
    {
      keywords: ['code', 'bug', 'working'],
      title: 'Why is my code not working?',
      answer: 'MalayaliOS algorithm inspected your code and started crying.'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    playSound('click');
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const lower = query.toLowerCase();
      const matched = predefinedResults.find((r) =>
        r.keywords.some((kw) => lower.includes(kw))
      );

      if (matched) {
        setActiveResult(matched);
      } else {
        setActiveResult({
          title: query,
          answer: 'ഈ ചോദ്യത്തിന് ഉത്തരം നാട്ടിലെ ആർക്കും അറിയില്ല.'
        });
      }
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Browser Bar */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 space-y-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-emerald-400">നാട്ടിലെ Browser</span>
          </div>
          <div className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-mono">https://www.naatile-google.com</span>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Google-നോട്‌ എന്തെങ്കിലും ചോദിക്ക് (e.g. Best biriyani, How to study...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Main Web Page Content */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950/40">
        {isSearching ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-emerald-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-mono font-bold"> Searching നാട്ടിലെ Database...</p>
          </div>
        ) : activeResult ? (
          <div className="max-w-xl mx-auto space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                VERIFIED NAATILE SEARCH RESULT
              </span>
              <h3 className="text-xl font-bold text-amber-400">
                {activeResult.title}
              </h3>
            </div>
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed">
              {activeResult.answer}
            </div>
            <div className="text-[11px] text-slate-500 text-right">
              Powered by Naatile Internet™
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-3xl">
              🌐
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-200">
                നാട്ടിലെ Browser 1.0
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Type any query above to receive 100% accurate unnecessary answers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
