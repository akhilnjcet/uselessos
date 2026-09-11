import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { VideoLinkModal } from '../VideoLinkModal';
import { Play, Sparkles, Tv, Clock, Eye, Film, RefreshCw, Link } from 'lucide-react';

export const CharacterApp = ({ characterId }) => {
  const { characters, openVideoPlayer, customVideoLinks, setCustomVideoLink, removeCustomVideoLink } = useOS();
  const targetId = typeof characterId === 'object' ? characterId?.characterId : characterId;
  const character = characters.find((c) => c.id === targetId) || characters[0];
  
  const [loadingVideoId, setLoadingVideoId] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlaylist = async () => {
      if (!character?.playlistId) return;
      setIsFetchingPlaylist(true);
      try {
        const res = await fetch(`/api/playlist/${character.playlistId}`);
        const data = await res.json();
        if (isMounted && data.videos && data.videos.length > 0) {
          setPlaylistVideos(data.videos);
        }
      } catch (err) {
        console.warn('[MalayaliOS] Playlist fetch failed, using fallback videos:', err);
      } finally {
        if (isMounted) setIsFetchingPlaylist(false);
      }
    };

    fetchPlaylist();

    return () => { isMounted = false; };
  }, [character?.playlistId]);

  const displayVideos = playlistVideos.length > 0 ? playlistVideos : (character.sampleVideos || []);

  const handleVideoClick = (video) => {
    const cardId = video.id || video.videoId;
    const custom = customVideoLinks[cardId];
    const vId = custom?.videoId || cardId;

    setLoadingVideoId(vId);
    setTimeout(() => {
      setLoadingVideoId(null);
      openVideoPlayer(video, character.name);
    }, 300);
  };

  const handleOpenLinkModal = (e, video) => {
    e.stopPropagation(); // Don't trigger PLAY
    const cardId = video.id || video.videoId;
    const custom = customVideoLinks[cardId];
    
    setEditingVideo({
      ...video,
      cardId,
      youtubeUrl: custom?.youtubeUrl || `https://www.youtube.com/watch?v=${cardId}`
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden relative">
      {/* Video Link Modal */}
      {editingVideo && (
        <VideoLinkModal
          video={editingVideo}
          onSave={(videoId, youtubeUrl) => setCustomVideoLink(editingVideo.cardId, videoId, youtubeUrl)}
          onRemove={() => removeCustomVideoLink(editingVideo.cardId)}
          onClose={() => setEditingVideo(null)}
        />
      )}

      {/* Character Hero Banner */}
      <div
        className="p-5 sm:p-6 border-b border-slate-800 relative overflow-hidden flex-shrink-0"
        style={{ background: character.avatarBg || 'linear-gradient(135deg, #1e293b, #0f172a)' }}
      >
        <div className="absolute right-3 -bottom-4 opacity-10 text-8xl pointer-events-none select-none">
          {character.icon}
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/60 border border-white/20 backdrop-blur-md flex items-center justify-center text-3xl sm:text-4xl shadow-xl flex-shrink-0">
            {character.icon}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block">
              MalayaliOS Comedy Icon
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {character.name}
            </h2>
            <p className="text-amber-200 font-semibold italic text-sm sm:text-base">
              “{character.catchphrase}”
            </p>
            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 max-w-xl">
              {character.description}
            </p>
          </div>
        </div>
      </div>

      {/* App Subheader */}
      <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>ഇന്നത്തെ പരിപാടി: Troll കാണുക.</span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Film className="w-3.5 h-3.5" />
          <span>{displayVideos.length} Clips Available</span>
        </div>
      </div>

      {/* Scrollable Video Grid */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-slate-950/40">
        {isFetchingPlaylist ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-amber-400">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="text-xs font-mono font-bold">Loading Playlist Videos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayVideos.map((video, idx) => {
              const cardId = video.id || video.videoId;
              const custom = customVideoLinks[cardId];
              const activeId = custom?.videoId || cardId;
              const activeThumb = custom?.videoId
                ? `https://img.youtube.com/vi/${custom.videoId}/hqdefault.jpg`
                : (video.thumbnail || `https://img.youtube.com/vi/${cardId}/hqdefault.jpg`);

              return (
                <div
                  key={cardId || idx}
                  className="group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-between"
                >
                  {/* Thumbnail Header */}
                  <div
                    onClick={() => handleVideoClick(video)}
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={activeThumb}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Custom Link Badge */}
                    {custom?.youtubeUrl && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                        <Link className="w-2.5 h-2.5" /> CUSTOM LINK
                      </div>
                    )}

                    {/* Play Overlay Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-slate-950/80 text-slate-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-700/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {video.duration || '05:00'}
                    </div>
                  </div>

                  {/* Video Info & Controls Bar */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <h3
                      onClick={() => handleVideoClick(video)}
                      className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                    >
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {video.views || '1.2M views'}
                      </span>
                      
                      {/* 🔗 Link Button for editable video link */}
                      <button
                        onClick={(e) => handleOpenLinkModal(e, video)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-amber-500/20 text-amber-400 border border-slate-700 hover:border-amber-400/60 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Set/Edit Video Link"
                      >
                        <Link className="w-3.5 h-3.5" />
                        <span>Link</span>
                      </button>
                    </div>
                  </div>

                  {/* Loading skeleton state */}
                  {loadingVideoId === activeId && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                      <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-amber-400">Opening Video Player...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
