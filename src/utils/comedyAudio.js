// MalayaliOS Centralized Comedy Audio & Voice System
// Backend-driven Natural Malayalam Text-To-Speech System
// Strictly non-blocking, non-stacking, with server/client caching and audio context unlock.

class ComedyAudioManager {
  constructor() {
    this.voiceEnabled = true;
    this.sfxEnabled = true;
    this.volume = 0.8; // 0.0 to 1.0
    this.voiceStyle = 'Funny'; // 'Funny', 'Casual', 'Dramatic', 'Excited'
    this.unlocked = false;

    this.currentAudio = null;
    this.audioCache = new Map(); // In-memory client cache (key_style -> audioUrl)

    // Malayalam Comedy Dialogue Mapping
    this.dialogueTexts = {
      'battery20': 'എടാ... ബാറ്ററി ഇരുപത് ശതമാനം മാത്രമേ ഉള്ളൂ!',
      'battery10': 'ചാർജർ എടുക്കെടാ... ബാറ്ററി തീരാറായി!',
      'battery5': 'അയ്യോ... പണി പാളി! ബാറ്ററി തീരാൻ പോവാ!',
      'battery1': 'ഇനി ഞാൻ അധികം നേരം നിൽക്കില്ല കേട്ടോ!',
      'battery0': 'ശരി... ഞാൻ പോകുവാ.',
      'appClose1': 'ഇത്ര പെട്ടെന്ന് അടച്ചോ?',
      'appClose2': 'ശരി... ഞാൻ പോകുവാ.',
      'appClose3': 'വീണ്ടും തുറക്കുമെന്നറിയാം.',
      'appClose4': 'എന്നെ എന്തിനാ തുറന്നത് പിന്നെ?',
      'playerClose1': 'അത് മതി... ഇനി അടുത്തത് നോക്ക്.',
      'playerClose2': 'Video കഴിഞ്ഞു... ഇനി എന്താ പരിപാടി?',
      'minimize1': 'ശരി... ഒളിപ്പിച്ചോ.',
      'minimize2': 'ഞാൻ ഇവിടെ തന്നെ ഉണ്ടേ.',
      'error1': 'അയ്യോ... പണി പാളി!',
      'error2': 'ഇത് എന്താ സംഭവിച്ചത്?',
      'startup': 'MalayaliOS തുടങ്ങുന്നു... സിസ്റ്റം റെഡി.',
      'shutdown': 'ശരി... ഞാൻ ഇറങ്ങുവാ.',
      'chaayaReady': 'ചായ റെഡി!',
      'uselessAI1': 'എനിക്കും അറിയില്ല.',
      'uselessAI2': 'ഇതിന് ഞാൻ എന്ത് പറയാനാ?',
      'earthquake1': 'എടാ... ഭൂമി കുലുങ്ങുന്നുണ്ടല്ലോ!',
      'earthquake2': 'പേടിക്കണ്ട... ഇത് MalayaliOS ആണ്.',
      'rain1': 'മഴ തുടങ്ങി... ചായ എടുക്കാം!',
      'thunder1': 'മഴ കനക്കുന്നു... കുട എടുത്തോ!',
      'wind': 'എല്ലാം പറത്തിക്കൊണ്ടുപോകുന്നുണ്ട്!',
      'chaos': 'എന്തൊക്കെയാ ഇവിടെ നടക്കുന്നത്?',
      'night': 'ശുഭ രാത്രി... പക്ഷേ ഉറങ്ങണ്ട.',
      'rainbow': 'മഴ കഴിഞ്ഞു. ഇനി rainbow കാണാം.',
      'commonSense1': 'അത് ഇവിടെ ഇല്ല.',
      'commonSense2': 'കിട്ടിയില്ല.',
      'commonSense3': 'ഇനി നോക്കണ്ട.',
      'trashDelete': 'എന്നെ എന്തിനാ കളഞ്ഞത്? 😭',
      'trashEmpty': 'അയ്യോ... എല്ലാം പോയി!',
      'trashMultiple': 'ഇവിടെ ആരും safe അല്ല.',
      'trashOpenEmpty': 'ഇവിടെ ഒന്നുമില്ല.',
      'mouseTired1': 'കുറച്ച് പതുക്കെ ഓടിക്കെടാ.',
      'mouseTired2': 'Formula 1 ആണോ കളിക്കുന്നത്?',
      'ramPanic1': 'എനിക്ക് ശ്വാസം മുട്ടുന്നു.',
      'ramPanic2': 'ഒരുത്തൻ എങ്കിലും close ചെയ്യ്!',
      'ramPanic3': 'ഇനി എന്തെങ്കിലും ചെയ്താൽ ഞാൻ പോകും.',
      'ramPanic4': 'ഞാൻ ഒന്ന് പേടിപ്പിച്ചതാ.',
      'dogCrossing': 'ഒരു minute...',
      'dogThankYou': 'Thank you.',
      'trafficDetected': 'ഇവിടെ ആരും പോകുന്നില്ല.',
      'trafficCleared': 'Traffic cleared.',
      'chargerNotFound': 'Charger കണ്ടെത്താനായില്ല.',
      'chargerInHand': 'ചാർജർ കൈയിൽ തന്നെയുണ്ട്.',
      'ammavanQ1': 'എവിടെയാ പഠിക്കുന്നത്?',
      'ammavanQ2': 'ജോലി കിട്ടിയോ?',
      'ammavanQ3': 'കല്യാണം നോക്കുന്നില്ലേ?',
      'ammavanQ4': 'ശരി... വെച്ചേക്കാം.',
      'ammavanRejected': 'Call rejected. അമ്മാവൻ വീണ്ടും വിളിക്കും.',
      'cleanerScanned': '147 useless files found.',
      'cleanerCleaned': 'Cleaned: 0 bytes. നിന്റെ computer ഇതിനകം clean ആണ്.',
      'overheat90': 'System ചൂടാകുന്നു.',
      'overheat100': 'എടാ... ഞാൻ biriyani അല്ല!',
      'crowDropped': 'കാക്ക എന്തോ കൊണ്ടുവന്നു.',
      'someoneWatching': 'ആരോ നോക്കുന്നുണ്ടെന്ന് തോന്നുന്നില്ലേ?',
      'actuallyNobody': 'ആരും ഇല്ലെടാ.'
    };

    this.initAudioUnlock();
  }

  initAudioUnlock() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.unlocked = true;
      // Play silent dummy audio to unlock browser autoplay context
      const dummyAudio = new Audio();
      dummyAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      dummyAudio.play().catch(() => {});

      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);
  }

  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (!enabled) this.stop();
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
  }

  setVolume(vol) {
    this.volume = vol > 1 ? vol / 100 : vol;
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  setVoiceStyle(style) {
    this.voiceStyle = style || 'Funny';
  }

  // Stop current dialogue immediately to prevent overlapping audio
  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        // Ignore audio cleanup errors
      }
      this.currentAudio = null;
    }
  }

  // Asynchronous Natural Malayalam TTS Playback with caching, 10s timeout & non-blocking execution
  async play(keyOrText) {
    if (!this.voiceEnabled) return;

    const textToSpeak = this.dialogueTexts[keyOrText] || keyOrText;
    if (!textToSpeak) return;

    // Immediately stop any currently playing voice so dialogues never overlap
    this.stop();

    const cacheKey = `${textToSpeak}_${this.voiceStyle}`;

    try {
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        // Fetch generated natural TTS audio from backend API with 10-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, style: this.voiceStyle }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.audioUrl) {
          throw new Error('Invalid audio payload from TTS endpoint');
        }

        audioUrl = data.audioUrl;
        this.audioCache.set(cacheKey, audioUrl);
      }

      // Initialize audio object and play
      const audio = new Audio(audioUrl);
      audio.volume = this.volume;
      this.currentAudio = audio;

      audio.onended = () => {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
      };

      audio.onerror = () => {
        console.error('[MalayaliOS TTS] Failed to play backend audio file:', audioUrl);
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise.catch((err) => {
          console.warn('[MalayaliOS TTS] Playback prevented by browser or user state:', err.message);
        });
      }
    } catch (error) {
      console.error('[MalayaliOS TTS] Failed:', error.message || error);
      // Non-blocking error handling: UI remains responsive, notifications continue working cleanly
    }
  }

  playAppClose() {
    const options = ['appClose1', 'appClose2', 'appClose3', 'appClose4'];
    const selected = options[Math.floor(Math.random() * options.length)];
    this.play(selected);
  }

  playPlayerClose() {
    const options = ['playerClose1', 'playerClose2'];
    const selected = options[Math.floor(Math.random() * options.length)];
    this.play(selected);
  }

  playMinimize() {
    const options = ['minimize1', 'minimize2'];
    const selected = options[Math.floor(Math.random() * options.length)];
    this.play(selected);
  }

  playError() {
    const options = ['error1', 'error2'];
    const selected = options[Math.floor(Math.random() * options.length)];
    this.play(selected);
  }

  playUselessAI() {
    const options = ['uselessAI1', 'uselessAI2'];
    const selected = options[Math.floor(Math.random() * options.length)];
    this.play(selected);
  }
}

export const comedyAudio = new ComedyAudioManager();

