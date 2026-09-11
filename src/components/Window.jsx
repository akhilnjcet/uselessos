import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../context/OSContext';
import { Minus, Square, Copy, X } from 'lucide-react';

import { CharacterApp } from './apps/CharacterApp';
import { VideoPlayerApp } from './apps/VideoPlayerApp';
import { TrollCenterApp } from './apps/TrollCenterApp';
import { ChaayaApp } from './apps/ChaayaApp';
import { UselessAIApp } from './apps/UselessAIApp';
import { NothingApp } from './apps/NothingApp';
import { PaniPaaliApp } from './apps/PaniPaaliApp';
import { FileManagerApp } from './apps/FileManagerApp';
import { BrowserApp } from './apps/BrowserApp';
import { WhatsAppApp } from './apps/WhatsAppApp';
import { SettingsApp } from './apps/SettingsApp';
import { EarthquakeApp } from './apps/EarthquakeApp';
import { RainApp } from './apps/RainApp';
import { NightSkyApp } from './apps/NightSkyApp';
import { ChaosModeApp } from './apps/ChaosModeApp';
import { EnvironmentApp } from './apps/EnvironmentApp';
import { CommonSenseApp } from './apps/CommonSenseApp';
import { FindMyChargerApp } from './apps/FindMyChargerApp';
import { AmmavanCallApp } from './apps/AmmavanCallApp';
import { ComputerCleanerApp } from './apps/ComputerCleanerApp';
import { AstroTalkApp } from './apps/AstroTalkApp';

export const Window = ({ windowData }) => {
  const {
    id,
    title,
    icon,
    appType,
    props,
    position,
    size,
    isMinimized,
    isMaximized,
    zIndex
  } = windowData;

  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize
  } = useOS();

  const isFocused = activeWindowId === id;
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ w: 0, h: 0, mouseX: 0, mouseY: 0 });

  // Handle Dragging
  const handleTitleMouseDown = (e) => {
    if (isMaximized) return;
    focusWindow(id);
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const nextX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffsetRef.current.x));
      const nextY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y));
      updateWindowPosition(id, { x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resizing
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    if (isMaximized) return;
    focusWindow(id);
    isResizingRef.current = true;
    resizeStartRef.current = {
      w: size.width,
      h: size.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    };

    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const deltaX = e.clientX - resizeStartRef.current.mouseX;
      const deltaY = e.clientY - resizeStartRef.current.mouseY;
      const nextW = Math.max(340, resizeStartRef.current.w + deltaX);
      const nextH = Math.max(260, resizeStartRef.current.h + deltaY);
      updateWindowSize(id, { width: nextW, height: nextH });
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Render Inner Application Component
  const renderAppComponent = () => {
    switch (appType) {
      case 'character':
        return <CharacterApp characterId={props?.characterId} />;
      case 'videoPlayer':
        return <VideoPlayerApp video={props?.video} characterName={props?.characterName} />;
      case 'trollCenter':
        return <TrollCenterApp />;
      case 'chaaya':
        return <ChaayaApp />;
      case 'uselessAI':
        return <UselessAIApp />;
      case 'nothing':
        return <NothingApp />;
      case 'paniPaali':
        return <PaniPaaliApp onClose={() => closeWindow(id)} />;
      case 'fileManager':
        return <FileManagerApp />;
      case 'browser':
        return <BrowserApp />;
      case 'whatsapp':
        return <WhatsAppApp />;
      case 'settings':
        return <SettingsApp />;
      case 'earthquake':
        return <EarthquakeApp />;
      case 'rain':
        return <RainApp />;
      case 'nightSky':
        return <NightSkyApp />;
      case 'chaosMode':
        return <ChaosModeApp />;
      case 'environment':
        return <EnvironmentApp />;
      case 'commonSense':
        return <CommonSenseApp />;
      case 'findMyCharger':
        return <FindMyChargerApp />;
      case 'ammavanCall':
        return <AmmavanCallApp />;
      case 'computerCleaner':
        return <ComputerCleanerApp />;
      case 'astroTalk':
        return <AstroTalkApp />;
      default:
        return (
          <div className="p-6 text-slate-300 font-sans">
            Unknown application.
          </div>
        );
    }
  };

  if (isMinimized) return null;

  return (
    <div
      onClick={() => focusWindow(id)}
      className={`fixed flex flex-col rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-shadow duration-300 ${
        isFocused
          ? 'ring-2 ring-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
          : 'ring-1 ring-slate-800/80 shadow-lg opacity-95'
      }`}
      style={{
        zIndex,
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0 : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`,
        borderRadius: isMaximized ? '0px' : '16px'
      }}
    >
      {/* OS Window Title Bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(id)}
        className={`h-11 px-4 flex items-center justify-between select-none cursor-move border-b transition-colors flex-shrink-0 ${
          isFocused
            ? 'bg-slate-900/95 border-slate-700/80 text-slate-100'
            : 'bg-slate-950/90 border-slate-800/60 text-slate-400'
        }`}
      >
        {/* Left Title & Icon */}
        <div className="flex items-center gap-2.5 truncate font-bold text-xs sm:text-sm">
          <span className="text-lg">{icon}</span>
          <span className="truncate">{title}</span>
        </div>

        {/* Right Window Action Buttons */}
        <div className="flex items-center gap-1.5" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(id)}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleMaximizeWindow(id)}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            onClick={() => closeWindow(id)}
            className="w-7 h-7 rounded-lg hover:bg-red-600/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body Container */}
      <div className="flex-1 overflow-hidden relative bg-slate-950">
        {renderAppComponent()}
      </div>

      {/* Bottom Right Resize Handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center z-50 group"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-500 group-hover:border-amber-400" />
        </div>
      )}
    </div>
  );
};
