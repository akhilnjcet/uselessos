import React, { useState } from 'react';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';
import { Link, X, Trash2, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const VideoLinkModal = ({ video, onSave, onRemove, onClose }) => {
  const [url, setUrl] = useState(video?.youtubeUrl || (video?.id ? `https://www.youtube.com/watch?v=${video.id}` : ''));
  const [error, setError] = useState('');

  const extractedId = extractYouTubeVideoId(url);

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const vId = extractYouTubeVideoId(url);
    if (!vId) {
      setError('Could not extract a valid 11-character YouTube Video ID from this URL.');
      return;
    }

    onSave(vId, url.trim());
    onClose();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
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
            <Link className="w-4 h-4" />
            <span>{video?.youtubeUrl ? 'Edit Video Link' : 'Set Video Link'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Title Context */}
        <div className="text-xs text-slate-300 font-semibold truncate bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          Target: <span className="text-amber-300">{video?.title || 'Selected Video'}</span>
        </div>

        {/* URL Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              YouTube URL / Link
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="e.g. https://www.youtube.com/watch?v=JiB4idMLgt0"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            {error && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>

          {/* Live Video ID & Thumbnail Preview */}
          {extractedId ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/60 flex items-center gap-3">
              <img
                src={`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`}
                alt="Preview"
                className="w-20 aspect-video object-cover rounded-lg border border-slate-700"
              />
              <div className="space-y-0.5 text-xs">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Video ID Extracted
                </div>
                <div className="font-mono text-[11px] text-amber-300">
                  {extractedId}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-950/60 rounded-xl text-[11px] text-slate-500 text-center italic">
              Paste a YouTube link above to see live thumbnail preview
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {video?.youtubeUrl ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 bg-red-950 hover:bg-red-900 text-red-400 border border-red-800/60 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> REMOVE LINK
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-lg"
              >
                <Save className="w-3.5 h-3.5" /> {video?.youtubeUrl ? 'UPDATE' : 'SAVE LINK'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
