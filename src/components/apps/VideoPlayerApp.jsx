import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export const VideoPlayerApp = ({ video, characterName = 'MalayaliOS' }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [funnyQuote, setFunnyQuote] = useState('ശരി... ഇനി ചിരിച്ചോ.');
  const [isLoading, setIsLoading] = useState(true);

  // Extract raw videoId string safely
  const videoId = typeof video === 'string' ? video : (video?.id || video?.videoId);
  const videoTitle = typeof video === 'object' && video?.title ? video.title : 'MalayaliOS Comedy Scene';

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : '';

  useEffect(() => {
    console.log('[MalayaliOS] Selected video:', video);
    console.log('[MalayaliOS] Video ID:', videoId);
    console.log('[MalayaliOS] Embed URL:', embedUrl);

    setHasError(false);
    setIsLoading(true);

    const quotes = [
      'ശരി... ഇനി ചിരിച്ചോ.',
      'Video കിട്ടി.',
      'ചിരി നിർത്തിയാൽ പണി കിട്ടും!',
      'ഇത് മുഴുവൻ കണ്ടിട്ടേ പോകാവൂ.',
      'MalayaliOS Certified Troll Scene.'
    ];
    setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [videoId]);

  const handleIframeError = () => {
    console.error('[MalayaliOS] YouTube Iframe Error for Video ID:', videoId);
    setHasError(true);
    setFunnyQuote('ഈ video ഇവിടെ കളിക്കാൻ സമ്മതിച്ചില്ല 😭');
  };

  return (
    <div className="h-full flex flex-col bg-black text-slate-100 font-sans overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between flex-shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-amber-400">🎬 MalayaliOS Internal Player</span>
        </div>
        <div className="font-medium text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
          {funnyQuote}
        </div>
      </div>

      {/* Video Display Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-amber-400">Loading Video...</p>
            <p className="text-xs text-slate-500">YouTube-നും ഇന്ന് mood ഉണ്ടോ എന്ന് നോക്കുന്നു...</p>
          </div>
        )}

        {hasError || !videoId ? (
          <div className="p-6 text-center space-y-4 max-w-md bg-slate-900/90 rounded-2xl border border-red-900/50 backdrop-blur-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">
                ഈ video ഇവിടെ കളിക്കാൻ സമ്മതിച്ചില്ല 😭
              </h3>
              <p className="text-xs text-slate-400">
                YouTube embedding restriction or unavailable video detected for ID: <span className="font-mono text-amber-400">{videoId || 'N/A'}</span>
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => { setHasError(false); setIsLoading(true); }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" /> TRY ANOTHER VIDEO
              </button>
              {videoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open External
                </a>
              )}
            </div>
          </div>
        ) : (
          <iframe
            key={videoId}
            src={embedUrl}
            title={videoTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            onError={handleIframeError}
          />
        )}
      </div>

      {/* Bottom Video Metadata Footer */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="space-y-0.5 max-w-md">
          <h3 className="font-bold text-sm text-slate-100 truncate">
            {videoTitle}
          </h3>
          <p className="text-xs text-amber-400 font-semibold">
            {characterName} • Embedded inside MalayaliOS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors cursor-pointer"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
