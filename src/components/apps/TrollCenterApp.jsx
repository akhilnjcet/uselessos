import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { TROLL_CATEGORIES, TROLL_VIDEOS } from '../../config/trollCategories';
import { VideoLinkModal } from '../VideoLinkModal';
import { AddVideoModal } from '../AddVideoModal';
import { Dices, Flame, Play, Film, Link, PlusCircle } from 'lucide-react';

export const TrollCenterApp = () => {
  const {
    openVideoPlayer,
    playSound,
    characters,
    customVideoLinks,
    setCustomVideoLink,
    removeCustomVideoLink,
    customAddedVideos,
    addCustomVideo
  } = useOS();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingVideo, setEditingVideo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Combine default videos with custom user added videos
  const allVideos = [...customAddedVideos, ...TROLL_VIDEOS];

  const filteredVideos =
    selectedCategory === 'all'
      ? allVideos
      : allVideos.filter((v) => v.category === selectedCategory);

  const handleRandomUseless = () => {
    playSound('click');
    const randomVid = allVideos[Math.floor(Math.random() * allVideos.length)];
    openVideoPlayer(randomVid, 'Troll Center');
  };

  const handleOpenLinkModal = (e, vid) => {
    e.stopPropagation(); // Don't trigger PLAY
    const cardId = vid.id || vid.videoId;
    const custom = customVideoLinks[cardId];
    
    setEditingVideo({
      ...vid,
      cardId,
      youtubeUrl: custom?.youtubeUrl || (vid.youtubeUrl ? vid.youtubeUrl : `https://www.youtube.com/watch?v=${cardId}`)
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Video Link Editor Modal */}
      {editingVideo && (
        <VideoLinkModal
          video={editingVideo}
          onSave={(videoId, youtubeUrl) => setCustomVideoLink(editingVideo.cardId, videoId, youtubeUrl)}
          onRemove={() => removeCustomVideoLink(editingVideo.cardId)}
          onClose={() => setEditingVideo(null)}
        />
      )}

      {/* Add Custom Video Modal */}
      {showAddModal && (
        <AddVideoModal
          characters={characters}
          onAdd={addCustomVideo}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 p-5 border-b border-red-900/40 flex-shrink-0 relative overflow-hidden">
        <div className="absolute right-4 -bottom-6 text-9xl opacity-10 pointer-events-none select-none">
          🔥
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-mono">
                TROLL DATABASE
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              The central warehouse of legendary Malayalam cinema trolls & memes.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Add Video Button */}
            <button
              onClick={() => { playSound('click'); setShowAddModal(true); }}
              className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>➕ Add Video</span>
            </button>

            {/* Large Random Useless Button */}
            <button
              onClick={handleRandomUseless}
              className="flex-1 sm:flex-initial px-4 py-3 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <Dices className="w-4 h-4 animate-spin" />
              <span>🎲 RANDOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
        {TROLL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { playSound('click'); setSelectedCategory(cat.id); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Video Content Grid */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((vid) => {
            const cardId = vid.id || vid.videoId;
            const custom = customVideoLinks[cardId];
            const activeThumb = custom?.videoId
              ? `https://img.youtube.com/vi/${custom.videoId}/hqdefault.jpg`
              : (vid.thumbnail || `https://img.youtube.com/vi/${cardId}/hqdefault.jpg`);

            return (
              <div
                key={cardId}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Thumbnail Header */}
                <div
                  onClick={() => openVideoPlayer(vid, vid.character)}
                  className="relative aspect-video bg-black overflow-hidden"
                >
                  <img
                    src={activeThumb}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Tag Badge */}
                  <div className="absolute top-2 left-2 bg-red-600/90 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {vid.tag || 'TROLL'}
                  </div>

                  {/* Custom Link Badge */}
                  {custom?.youtubeUrl && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1">
                      <Link className="w-2.5 h-2.5" /> CUSTOM LINK
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-amber-400 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                    {vid.duration || '05:00'}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info & Controls Bar */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <h3
                    onClick={() => openVideoPlayer(vid, vid.character)}
                    className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2"
                  >
                    {vid.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-800">
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <Film className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="truncate">{vid.character}</span>
                    </span>

                    {/* 🔗 Link Button for editable video link */}
                    <button
                      onClick={(e) => handleOpenLinkModal(e, vid)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-slate-700 hover:border-amber-400/60 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      title="Set/Edit Video Link"
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>Link</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
