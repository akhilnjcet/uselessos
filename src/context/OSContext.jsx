import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_CHARACTERS } from '../config/charactersConfig';
import { soundFx } from '../utils/soundEffects';
import { comedyAudio } from '../utils/comedyAudio';

const OSContext = createContext(null);

const BATTERY_CONFIG = {
  startingLevel: 100,
  drainInterval: 60000, // 60 seconds per 1%
  drainAmount: 1
};

export const OSProvider = ({ children }) => {
  const [isBooted, setIsBooted] = useState(false);
  const [isShutdown, setIsShutdown] = useState(false);
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [wallpaper, setWallpaper] = useState('tea_stall');
  const [teaLevel, setTeaLevel] = useState(100);

  // Comedy Voice & Audio Settings
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true);
  const [comedySoundEffectsEnabled, setComedySoundEffectsEnabled] = useState(true);
  const [comedyVoiceVolume, setComedyVoiceVolume] = useState(80);
  const [voiceStyle, setVoiceStyle] = useState('Funny'); // 'Funny', 'Casual', 'Dramatic', 'Excited'

  // Environmental Nature & Chaos System State
  const [activeEffects, setActiveEffects] = useState({
    rain: false,
    earthquake: false,
    wind: false,
    thunder: false,
    night: false,
    rainbow: false,
    chaos: false,
    dogCrossing: false,
    crowEvent: false,
    keralaTraffic: false,
    overheat: false
  });
  const [earthquakeLevel, setEarthquakeLevel] = useState(0);
  const [cinematicMode, setCinematicMode] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [ramUsage, setRamUsage] = useState(45);
  const [isRamFrozen, setIsRamFrozen] = useState(false);
  const [cpuTemp, setCpuTemp] = useState(45);
  const [isOverheating, setIsOverheating] = useState(false);
  const [isCctvActive, setIsCctvActive] = useState(false);
  const [effectSettings, setEffectSettings] = useState({
    intensity: 'HIGH',
    particleQuality: 'HIGH',
    enable3DEffects: true,
    enableCameraEffects: true,
    enableWeatherEffects: true,
    enableEnvironmentalSounds: true,
    enableComedyDialogues: true
  });
  const earthquakeCooldownRef = useRef(false);

  // Simulated Battery State
  const [batteryLevel, setBatteryLevel] = useState(BATTERY_CONFIG.startingLevel);
  const [batteryStatus, setBatteryStatus] = useState('Discharging...');
  const [isFakeCharging, setIsFakeCharging] = useState(false);
  const triggeredAlertsRef = useRef(new Set());

  // Custom Video Links Storage (cardId -> { videoId, youtubeUrl })
  const [customVideoLinks, setCustomVideoLinks] = useState(() => {
    const saved = localStorage.getItem('malayaliOS_customVideoLinks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {};
  });

  // Custom Added Videos Storage Array
  const [customAddedVideos, setCustomAddedVideos] = useState(() => {
    const saved = localStorage.getItem('malayaliOS_customAddedVideos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem('malayaliOS_characters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_CHARACTERS; }
    }
    return DEFAULT_CHARACTERS;
  });

  // Sync settings with comedyAudio system
  useEffect(() => {
    comedyAudio.setVoiceEnabled(voiceAlertsEnabled);
    comedyAudio.setSfxEnabled(comedySoundEffectsEnabled);
    comedyAudio.setVolume(comedyVoiceVolume);
    comedyAudio.setVoiceStyle(voiceStyle);
  }, [voiceAlertsEnabled, comedySoundEffectsEnabled, comedyVoiceVolume, voiceStyle]);

  // Persist customVideoLinks & customAddedVideos
  useEffect(() => {
    localStorage.setItem('malayaliOS_customVideoLinks', JSON.stringify(customVideoLinks));
  }, [customVideoLinks]);

  useEffect(() => {
    localStorage.setItem('malayaliOS_customAddedVideos', JSON.stringify(customAddedVideos));
  }, [customAddedVideos]);

  // Save characters to localStorage
  useEffect(() => {
    localStorage.setItem('malayaliOS_characters', JSON.stringify(characters));
  }, [characters]);

  // Handle Custom Link methods
  const setCustomVideoLink = (cardId, videoId, youtubeUrl) => {
    setCustomVideoLinks((prev) => ({
      ...prev,
      [cardId]: { videoId, youtubeUrl }
    }));
    addNotification('Video Link Saved', `Custom link saved for video.`, '🔗');
  };

  const removeCustomVideoLink = (cardId) => {
    setCustomVideoLinks((prev) => {
      const copy = { ...prev };
      delete copy[cardId];
      return copy;
    });
    addNotification('Link Removed', 'Custom link removed. Default restored.', '🗑️');
  };

  const addCustomVideo = (newVideo) => {
    setCustomAddedVideos((prev) => [newVideo, ...prev]);
    addNotification('Video Added', `"${newVideo.title}" added to Troll Center.`, '➕');
  };

  // Handle Mute state change
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundFx.setMuted(nextMute);
    if (!nextMute) soundFx.playClick();
  };

  // Sound wrapper
  const playSound = (type) => {
    if (isMuted) return;
    if (type === 'boot') soundFx.playBoot();
    if (type === 'click') soundFx.playClick();
    if (type === 'error') {
      soundFx.playError();
      comedyAudio.playError();
    }
    if (type === 'notification') soundFx.playNotification();
    if (type === 'tea') soundFx.playTeaPour();
    if (type === 'shutdown') soundFx.playShutdown();
  };

  // Floating Toast Notification
  const addNotification = (title, message, icon = '🔔') => {
    const id = 'notif_' + Date.now() + '_' + Math.random();
    setNotifications((prev) => [...prev, { id, title, message, icon }]);
    playSound('notification');

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Simulated Battery Drain Loop
  useEffect(() => {
    if (!isBooted || isShutdown || isFakeCharging) return;

    const interval = setInterval(() => {
      setBatteryLevel((prevLevel) => {
        if (prevLevel <= 0) return 0;
        const nextLevel = Math.max(0, prevLevel - BATTERY_CONFIG.drainAmount);

        if (nextLevel === 80 && !triggeredAlertsRef.current.has(80)) {
          triggeredAlertsRef.current.add(80);
          addNotification('Battery Status', 'Battery ok. ജീവിതം സുഖം. 🔋', '🔋');
        } else if (nextLevel === 60 && !triggeredAlertsRef.current.has(60)) {
          triggeredAlertsRef.current.add(60);
          addNotification('Battery Status', 'ഇനിയും tension വേണ്ട. 🔋', '🔋');
        } else if (nextLevel === 40 && !triggeredAlertsRef.current.has(40)) {
          triggeredAlertsRef.current.add(40);
          addNotification('Battery Warning', 'കുറച്ച് ശ്രദ്ധിച്ചാൽ നന്നായിരിക്കും. 🔋', '🔋');
        } else if (nextLevel === 30 && !triggeredAlertsRef.current.has(30)) {
          triggeredAlertsRef.current.add(30);
          addNotification('Battery Warning', 'ചാർജർ എവിടെയോ കണ്ടതുപോലെ... 🔋', '🔋');
        } else if (nextLevel === 20 && !triggeredAlertsRef.current.has(20)) {
          triggeredAlertsRef.current.add(20);
          addNotification('🔋 Battery Warning 20%', '"എടാ... ബാറ്ററി ഇരുപത് ശതമാനം മാത്രമേ ഉള്ളൂ!"', '🔋');
          comedyAudio.play('battery20');
        } else if (nextLevel === 10 && !triggeredAlertsRef.current.has(10)) {
          triggeredAlertsRef.current.add(10);
          addNotification('🪫 Critical Battery 10%', '"ചാർജർ എടുക്കെടാ... ബാറ്ററി തീരാറായി!"', '🪫');
          comedyAudio.play('battery10');
        } else if (nextLevel === 5 && !triggeredAlertsRef.current.has(5)) {
          triggeredAlertsRef.current.add(5);
          addNotification('🚨 Critical Battery 5%', '"അയ്യോ... പണി പാളി! ബാറ്ററി തീരാൻ പോവാ!"', '🪫');
          comedyAudio.play('battery5');
        } else if (nextLevel === 1 && !triggeredAlertsRef.current.has(1)) {
          triggeredAlertsRef.current.add(1);
          addNotification('💀 Critical Battery 1%', '"ഇനി ഞാൻ അധികം നേരം നിൽക്കില്ല കേട്ടോ!"', '🪫');
          comedyAudio.play('battery1');
        } else if (nextLevel === 0 && !triggeredAlertsRef.current.has(0)) {
          triggeredAlertsRef.current.add(0);
          addNotification('🔴 Battery Dead 0%', '"ശരി... ഞാൻ പോകുവാ."', '🪫');
          comedyAudio.play('battery0');
          setTimeout(() => setIsShutdown(true), 2500);
        }

        return nextLevel;
      });
    }, BATTERY_CONFIG.drainInterval);

    return () => clearInterval(interval);
  }, [isBooted, isShutdown, isFakeCharging]);

  // Go to Chaaya Shop = Full Charge ☕
  const chargeBatteryFull = () => {
    setIsFakeCharging(true);
    setBatteryStatus('Charging at Chaaya Stall...');
    playSound('click');

    setTimeout(() => {
      setBatteryLevel(100);
      setBatteryStatus('Discharging...');
      setIsFakeCharging(false);
      triggeredAlertsRef.current.clear();
      addNotification(
        '☕ Chaaya Shop Charging',
        'ചായക്കടയിൽ എത്തിയപ്പോൾ battery full charge ആയി! 🔋 100%',
        '☕'
      );
      comedyAudio.play('chaayaReady');
    }, 1200);
  };

  // Animated Fake Charge
  const fakeChargeBattery = () => {
    setIsFakeCharging(true);
    setBatteryStatus('Fake Charging...');
    playSound('click');

    const steps = [
      { lvl: 25, msg: 'Finding charger...' },
      { lvl: 50, msg: 'Plugging in...' },
      { lvl: 75, msg: 'Charging fast...' },
      { lvl: 100, msg: '100%! Full charge! 🔋' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setBatteryLevel(steps[stepIdx].lvl);
        addNotification('🔌 Fake Charge', steps[stepIdx].msg, '⚡');
        stepIdx++;
      } else {
        clearInterval(interval);
        setBatteryStatus('Discharging...');
        setIsFakeCharging(false);
        triggeredAlertsRef.current.clear();
        addNotification('🔌 Charge Complete', 'ഇനി വീണ്ടും drain തുടങ്ങും 😂', '🔋');
      }
    }, 800);
  };

  const resetBatteryOnBoot = () => {
    setBatteryLevel(100);
    setBatteryStatus('Discharging...');
    setIsFakeCharging(false);
    triggeredAlertsRef.current.clear();
  };

  // --- Nature & Chaos Effect Handlers ---
  const activateEarthquake = () => {
    if (earthquakeCooldownRef.current) {
      addNotification('🌍 Earthquake Cooldown', 'ഭൂമി കുലുങ്ങിത്തീരാൻ കാത്തിരിക്ക്!', '⚠️');
      return;
    }
    earthquakeCooldownRef.current = true;
    setActiveEffects((prev) => ({ ...prev, earthquake: true }));
    addNotification('⚠️ Earthquake Alert', 'Level 1: ചെറിയ കുലുക്കം! (Vibrations)', '🌍');
    setEarthquakeLevel(1);
    comedyAudio.play('earthquake1');

    setTimeout(() => {
      setEarthquakeLevel(2);
      addNotification('⚠️ Earthquake Warning', 'Level 2: മിതമായ കുലുക്കം! (Medium shaking)', '🌍');
    }, 2500);

    setTimeout(() => {
      setEarthquakeLevel(3);
      addNotification('🚨 EARTHQUAKE WARNING', 'Level 3: ശക്തമായ കുലുക്കം! (Strong shaking)', '🌍');
      comedyAudio.play('earthquake2');
    }, 5500);

    setTimeout(() => {
      setEarthquakeLevel(4);
      addNotification('💥 CHAOS EARTHQUAKE', 'Level 4: CHAOS MODE! (Extreme Shaking)', '💥');
    }, 9000);

    setTimeout(() => {
      setEarthquakeLevel(0);
      setActiveEffects((prev) => ({ ...prev, earthquake: false }));
      addNotification('🌍 Earthquake Ended', 'നമ്മൾ രക്ഷപ്പെട്ടു! (We survived)', '✅');
      setTimeout(() => {
        earthquakeCooldownRef.current = false;
      }, 3000);
    }, 14000);
  };

  const toggleEffect = (effectKey) => {
    setActiveEffects((prev) => {
      const nextVal = !prev[effectKey];
      if (nextVal) {
        if (effectKey === 'rain') comedyAudio.play('rain1');
        if (effectKey === 'thunder') comedyAudio.play('thunder1');
        if (effectKey === 'wind') comedyAudio.play('wind');
        if (effectKey === 'chaos') comedyAudio.play('chaos');
        if (effectKey === 'night') comedyAudio.play('night');
        if (effectKey === 'rainbow') comedyAudio.play('rainbow');
      }
      return { ...prev, [effectKey]: nextVal };
    });
  };

  const stopEffect = (effectKey) => {
    setActiveEffects((prev) => ({ ...prev, [effectKey]: false }));
  };

  const stopAllEffects = () => {
    setActiveEffects({
      rain: false,
      earthquake: false,
      wind: false,
      thunder: false,
      night: false,
      rainbow: false,
      chaos: false,
      dogCrossing: false,
      crowEvent: false,
      keralaTraffic: false,
      overheat: false
    });
    setEarthquakeLevel(0);
    setCinematicMode(false);
    setIsOverheating(false);
    addNotification('🌍 Nature Reset', 'All environmental effects stopped.', '🌿');
  };

  // --- Funny Features Trigger Handlers ---
  const triggerDogCrossing = () => {
    setActiveEffects((prev) => ({ ...prev, dogCrossing: true }));
    addNotification('🐕 Dog Crossing', '“ഒരു minute...”', '🐕');
    comedyAudio.play('dogCrossing');

    setTimeout(() => {
      setActiveEffects((prev) => ({ ...prev, dogCrossing: false }));
      addNotification('🐕 Dog Crossing', '“Thank you.”', '✅');
      comedyAudio.play('dogThankYou');
    }, 7000);
  };

  const triggerCrowEvent = () => {
    setActiveEffects((prev) => ({ ...prev, crowEvent: true }));
    comedyAudio.play('crowDropped');
    addNotification('🐦 Random Crow', 'കാക്ക എന്തോ കൊണ്ടുവന്നു.', '🐦');

    setTimeout(() => {
      setActiveEffects((prev) => ({ ...prev, crowEvent: false }));
    }, 6000);
  };

  const triggerKeralaTraffic = () => {
    setActiveEffects((prev) => ({ ...prev, keralaTraffic: true }));
    addNotification('🚨 TRAFFIC DETECTED', '“ഇവിടെ ആരും പോകുന്നില്ല.”', '🚦');
    comedyAudio.play('trafficDetected');

    setTimeout(() => {
      addNotification('🚦 Kerala Traffic', 'Traffic cleared.', '✅');
      comedyAudio.play('trafficCleared');
      setActiveEffects((prev) => ({ ...prev, keralaTraffic: false }));
    }, 8000);
  };

  const triggerRamPanic = () => {
    setRamUsage(82);
    addNotification('💾 RAM Usage', 'RAM 82%', '💾');

    setTimeout(() => {
      setRamUsage(90);
      addNotification('💾 RAM Warning', '“എനിക്ക് ശ്വാസം മുട്ടുന്നു.” (RAM 90%)', '⚠️');
      comedyAudio.play('ramPanic1');
    }, 1500);

    setTimeout(() => {
      setRamUsage(95);
      addNotification('💾 RAM Alert', '“ഒരുത്തൻ എങ്കിലും close ചെയ്യ്!” (RAM 95%)', '🚨');
      comedyAudio.play('ramPanic2');
    }, 3200);

    setTimeout(() => {
      setRamUsage(99);
      addNotification('💾 RAM Critical', '“ഇനി എന്തെങ്കിലും ചെയ്താൽ ഞാൻ പോകും.” (RAM 99%)', '💀');
      comedyAudio.play('ramPanic3');
    }, 5000);

    setTimeout(() => {
      setRamUsage(100);
      setIsRamFrozen(true);
      setTimeout(() => {
        setIsRamFrozen(false);
        setRamUsage(45);
        addNotification('💾 RAM Recovered', '“ഞാൻ ഒന്ന് പേടിപ്പിച്ചതാ.” 😂', '✅');
        comedyAudio.play('ramPanic4');
      }, 2000);
    }, 7000);
  };

  const triggerOverheat = () => {
    setIsOverheating(true);
    setActiveEffects((prev) => ({ ...prev, overheat: true }));
    setCpuTemp(60);

    setTimeout(() => setCpuTemp(75), 1000);
    setTimeout(() => {
      setCpuTemp(90);
      addNotification('🌡️ Temp Warning', '“System ചൂടാകുന്നു.” (90°C)', '🔥');
      comedyAudio.play('overheat90');
    }, 2500);

    setTimeout(() => {
      setCpuTemp(100);
      addNotification('🔥 OVERHEAT ALERT', '“എടാ... ഞാൻ biriyani അല്ല!” (100°C)', '🌋');
      comedyAudio.play('overheat100');
    }, 4500);

    setTimeout(() => {
      setCpuTemp(80);
    }, 7000);

    setTimeout(() => {
      setCpuTemp(45);
      setIsOverheating(false);
      setActiveEffects((prev) => ({ ...prev, overheat: false }));
      addNotification('🌡️ Cooled Down', 'System temperature restored to 45°C.', '❄️');
    }, 9500);
  };

  const triggerSomeoneWatching = () => {
    setIsCctvActive(true);
    addNotification('👀 SECURITY ALERT', '“ആരോ നോക്കുന്നുണ്ടെന്ന് തോന്നുന്നില്ലേ?”', '📹');
    comedyAudio.play('someoneWatching');

    setTimeout(() => {
      addNotification('👀 CCTV Update', '“ആരും ഇല്ലെടാ.” 😂', '✅');
      comedyAudio.play('actuallyNobody');
      setIsCctvActive(false);
    }, 3000);
  };

  // ESC Listener to exit Cinematic Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && cinematicMode) {
        setCinematicMode(false);
        addNotification('Cinematic Mode', 'Exited Cinematic Mode. ⛶', '🎬');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cinematicMode]);

  // Open an app window
  const openApp = (appType, props = {}, title = 'Application', icon = '💻') => {
    playSound('click');

    const existing = windows.find(
      (w) => w.appType === appType && w.props?.characterId === props?.characterId
    );

    if (existing) {
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, props, title, icon, isMinimized: false, zIndex: nextZ }
            : w
        )
      );
      setActiveWindowId(existing.id);
      return existing.id;
    }

    const newId = 'win_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);

    const offset = (windows.length % 6) * 30;
    const defaultPos = { x: 100 + offset, y: 60 + offset };
    const defaultSize = { width: 780, height: 520 };

    const isMobile = window.innerWidth <= 768;
    const initialPos = isMobile ? { x: 10, y: 20 } : defaultPos;
    const initialSize = isMobile
      ? { width: window.innerWidth - 20, height: window.innerHeight - 100 }
      : defaultSize;

    const newWindow = {
      id: newId,
      appType,
      props,
      title,
      icon,
      position: initialPos,
      size: initialSize,
      isMinimized: false,
      isMaximized: isMobile,
      zIndex: nextZ
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newId);
    return newId;
  };

  const openVideoPlayer = (video, characterName = 'MalayaliOS') => {
    // Check if custom video link override exists for this video
    const cardId = video?.id || video?.videoId;
    const customLink = customVideoLinks[cardId];
    
    let activeVideo = video;
    if (customLink && customLink.videoId) {
      activeVideo = {
        ...video,
        id: customLink.videoId,
        videoId: customLink.videoId,
        youtubeUrl: customLink.youtubeUrl,
        thumbnail: `https://img.youtube.com/vi/${customLink.videoId}/hqdefault.jpg`
      };
    }

    openApp(
      'videoPlayer',
      { video: activeVideo, characterName },
      `🎬 ${activeVideo.title ? activeVideo.title.slice(0, 30) : 'Video Player'}...`,
      '🎬'
    );
  };

  const closeWindow = (id) => {
    playSound('click');
    const targetWin = windows.find((w) => w.id === id);

    if (targetWin?.appType === 'videoPlayer') {
      comedyAudio.playPlayerClose();
      addNotification('🎬 Player Closed', '“അത് മതി... ഇനി അടുത്തത് നോക്ക്.”', '🎬');
    } else {
      comedyAudio.playAppClose();
      addNotification('❌ App Closed', '“അയ്യോ... അടച്ചുകളഞ്ഞു!”', '👋');
    }

    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0]);
        setActiveWindowId(topWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id) => {
    playSound('click');
    comedyAudio.playMinimize();
    addNotification('🔻 App Minimized', '“ഞാൻ ഇവിടെ തന്നെ ഉണ്ടേ.”', '📌');

    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const activeList = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (activeList.length > 0) {
        const topWindow = activeList.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), activeList[0]);
        setActiveWindowId(topWindow.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const toggleMaximizeWindow = (id) => {
    playSound('click');
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusWindow = (id) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;
    
    if (target.isMinimized) {
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZ } : w))
      );
      setActiveWindowId(id);
    } else if (activeWindowId !== id) {
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w))
      );
      setActiveWindowId(id);
    }
  };

  const updateWindowPosition = (id, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (id, size) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  const updateCharacter = (characterId, updatedFields) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === characterId ? { ...c, ...updatedFields } : c))
    );
    addNotification('System Updated', 'Character settings updated successfully.', '⚙️');
  };

  return (
    <OSContext.Provider
      value={{
        isBooted,
        setIsBooted,
        isShutdown,
        setIsShutdown,
        windows,
        activeWindowId,
        openApp,
        openVideoPlayer,
        closeWindow,
        minimizeWindow,
        toggleMaximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        notifications,
        addNotification,
        removeNotification,
        isMuted,
        toggleMute,
        playSound,
        wallpaper,
        setWallpaper,
        teaLevel,
        setTeaLevel,
        characters,
        updateCharacter,
        batteryLevel,
        batteryStatus,
        chargeBatteryFull,
        fakeChargeBattery,
        resetBatteryOnBoot,
        voiceAlertsEnabled,
        setVoiceAlertsEnabled,
        comedySoundEffectsEnabled,
        setComedySoundEffectsEnabled,
        comedyVoiceVolume,
        setComedyVoiceVolume,
        voiceStyle,
        setVoiceStyle,
        // Custom Video Link Management
        customVideoLinks,
        customAddedVideos,
        setCustomVideoLink,
        removeCustomVideoLink,
        addCustomVideo,
        // Nature & Chaos System
        activeEffects,
        setActiveEffects,
        earthquakeLevel,
        cinematicMode,
        setCinematicMode,
        performanceMode,
        setPerformanceMode,
        effectSettings,
        setEffectSettings,
        activateEarthquake,
        toggleEffect,
        stopEffect,
        stopAllEffects,
        // Funny Features State & Triggers
        ramUsage,
        isRamFrozen,
        cpuTemp,
        isOverheating,
        isCctvActive,
        triggerDogCrossing,
        triggerCrowEvent,
        triggerKeralaTraffic,
        triggerRamPanic,
        triggerOverheat,
        triggerSomeoneWatching
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => useContext(OSContext);
