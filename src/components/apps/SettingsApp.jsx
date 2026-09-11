import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Settings, Volume2, VolumeX, Image, Save, RefreshCw, UserCheck, Mic, Sliders } from 'lucide-react';

export const SettingsApp = () => {
  const {
    wallpaper,
    setWallpaper,
    isMuted,
    toggleMute,
    characters,
    updateCharacter,
    playSound,
    voiceAlertsEnabled,
    setVoiceAlertsEnabled,
    comedySoundEffectsEnabled,
    setComedySoundEffectsEnabled,
    comedyVoiceVolume,
    setComedyVoiceVolume,
    voiceStyle,
    setVoiceStyle
  } = useOS();

  const [selectedCharId, setSelectedCharId] = useState(characters[0]?.id || '');
  const selectedChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const [charForm, setCharForm] = useState({
    name: selectedChar?.name || '',
    catchphrase: selectedChar?.catchphrase || '',
    playlistId: selectedChar?.playlistId || '',
    icon: selectedChar?.icon || '🎭',
    themeColor: selectedChar?.themeColor || '#3b82f6'
  });

  const handleSelectChar = (id) => {
    setSelectedCharId(id);
    const char = characters.find((c) => c.id === id);
    if (char) {
      setCharForm({
        name: char.name,
        catchphrase: char.catchphrase,
        playlistId: char.playlistId,
        icon: char.icon,
        themeColor: char.themeColor
      });
    }
  };

  const handleSaveChar = (e) => {
    e.preventDefault();
    playSound('click');
    updateCharacter(selectedCharId, charForm);
  };

  const handleResetOS = () => {
    playSound('error');
    if (window.confirm('Reset all MalayaliOS settings to factory defaults?')) {
      localStorage.removeItem('malayaliOS_characters');
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center gap-3 flex-shrink-0">
        <Settings className="w-6 h-6 text-amber-500 animate-spin-slow" />
        <div>
          <h2 className="text-xl font-bold text-slate-100">MalayaliOS Settings</h2>
          <p className="text-xs text-slate-400">
            Configure comedy voices, sound effects, battery alerts & YouTube playlists.
          </p>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
        {/* 1. Comedy & Voice Settings Panel */}
        <div className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Comedy & Voice Settings</span>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono">SEPARATE FROM VIDEO AUDIO</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice Dialogues Toggle */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-200">🎙️ Comedy Voice Dialogues</h4>
                <p className="text-[10px] text-slate-400">Battery alerts & app close Malayalam voices</p>
              </div>
              <button
                onClick={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  voiceAlertsEnabled
                    ? 'bg-emerald-600 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {voiceAlertsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Sound FX Toggle */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-200">🔊 Comedy Sound Effects</h4>
                <p className="text-[10px] text-slate-400">Tea pour, clicks & notification chimes</p>
              </div>
              <button
                onClick={() => setComedySoundEffectsEnabled(!comedySoundEffectsEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  comedySoundEffectsEnabled
                    ? 'bg-emerald-600 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {comedySoundEffectsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Comedy Voice Volume Slider */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>🎙️ Comedy Voice Volume</span>
              </span>
              <span className="font-mono text-amber-400">{comedyVoiceVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={comedyVoiceVolume}
              onChange={(e) => setComedyVoiceVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[10px] text-slate-500">
              Note: This controls only MalayaliOS comedy voice dialogue audio. Video playback volume remains independent.
            </p>
          </div>

          {/* Voice Style Selection */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>🎭 Voice Style</span>
              </span>
              <span className="font-mono text-amber-400 text-[11px]">{voiceStyle}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Funny', label: '😂 Funny (Default)' },
                { id: 'Casual', label: '💬 Casual' },
                { id: 'Dramatic', label: '🎭 Dramatic' },
                { id: 'Excited', label: '🔥 Excited' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => { playSound('click'); setVoiceStyle(style.id); }}
                  className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    voiceStyle === style.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Wallpaper Chooser */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Image className="w-4 h-4" />
            <span>Desktop Wallpaper Theme</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'tea_stall', name: '☕ Kerala Chaaya Shop (Default)' },
              { id: 'rainy_kerala', name: '🌧️ Rainy Village' },
              { id: 'sunset', name: '🌅 Sunset Backwaters' },
              { id: 'cyber_kerala', name: '⚡ Cyber Kerala' }
            ].map((wp) => (
              <button
                key={wp.id}
                onClick={() => { playSound('click'); setWallpaper(wp.id); }}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  wallpaper === wp.id
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {wp.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Character & Playlist Editor */}
        <div className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <UserCheck className="w-4 h-4" />
              <span>Character & YouTube Playlist Configuration</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">LIVE EDITABLE</span>
          </div>

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectChar(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCharId === c.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSaveChar} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Character Name
                </label>
                <input
                  type="text"
                  value={charForm.name}
                  onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  YouTube Playlist ID
                </label>
                <input
                  type="text"
                  value={charForm.playlistId}
                  onChange={(e) => setCharForm({ ...charForm, playlistId: e.target.value })}
                  placeholder="e.g. PL..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Catchphrase
              </label>
              <input
                type="text"
                value={charForm.catchphrase}
                onChange={(e) => setCharForm({ ...charForm, catchphrase: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Character Settings
              </button>
            </div>
          </form>
        </div>

        {/* 4. Global System Mute & Factory Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-200">Global Master Mute</h4>
              <p className="text-[10px] text-slate-400">Silence all OS audio synthesis</p>
            </div>
            <button
              onClick={toggleMute}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                isMuted ? 'bg-red-950 border-red-800 text-red-400' : 'bg-emerald-950 border-emerald-800 text-emerald-400'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-200">Factory Reset</h4>
              <p className="text-[10px] text-slate-400">Reset settings & clear custom data</p>
            </div>
            <button
              onClick={handleResetOS}
              className="px-4 py-2 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/60 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset OS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
