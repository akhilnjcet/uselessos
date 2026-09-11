import React, { useState } from 'react';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';
import { TROLL_CATEGORIES } from '../config/trollCategories';
import { PlusCircle, X, CheckCircle, AlertCircle } from 'lucide-react';

export const AddVideoModal = ({ characters, onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('comedy');
  const [characterId, setCharacterId] = useState(characters[0]?.id || 'character_manavalan');
  const [error, setError] = useState('');

  const extractedId = extractYouTubeVideoId(url);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    if (!url.trim()) {
      setError('Please enter a YouTube link');
      return;
    }

    const vId = extractYouTubeVideoId(url);
    if (!vId) {
      setError('Invalid YouTube link. Could not extract video ID.');
      return;
    }

    const selectedChar = characters.find((c) => c.id === characterId) || characters[0];

    const newVideo = {
      id: `custom_${Date.now()}`,
      title: title.trim(),
      videoId: vId,
      youtubeUrl: url.trim(),
      thumbnail: `https://img.youtube.com/vi/${vId}/hqdefault.jpg`,
      category: category || 'comedy',
      character: selectedChar?.name || 'MalayaliOS',
      characterId: selectedChar?.id,
      duration: '05:00',
      tag: 'CUSTOM'
    };

    onAdd(newVideo);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 select-none font-sans animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-slate-100 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Video</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Manavalan Best Troll Scene"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              YouTube Link
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Category & Character Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
              >
                {TROLL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Character
              </label>
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none cursor-pointer"
              >
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Extracted Thumbnail Preview */}
          {extractedId ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 flex items-center gap-3">
              <img
                src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
                alt="Preview"
                className="w-20 aspect-video object-cover rounded-lg border border-slate-700"
              />
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Valid YouTube Video
                </div>
                <div className="font-mono text-[11px] text-amber-300">
                  ID: {extractedId}
                </div>
              </div>
            </div>
          ) : null}

          {error && (
            <p className="text-[11px] text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" /> ADD VIDEO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
