import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Ensure public/audio/cache directory exists
const cacheDir = path.join(process.cwd(), 'public', 'audio', 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Serve cached audio files as static assets
app.use('/audio/cache', express.static(cacheDir));

// In-memory backend storage for video link overrides and custom added videos
const customVideoLinksStore = {};
const customAddedVideosStore = [];

// Curated real embeddable Malayalam comedy videos fallback database
const FALLBACK_PLAYLIST_VIDEOS = {
  default: [
    {
      id: "JiB4idMLgt0",
      title: "ദാസനും വിജയനും കൂടെ നമ്മളെ സുഖിപ്പിച്ച കോമഡി",
      thumbnail: "https://img.youtube.com/vi/JiB4idMLgt0/hqdefault.jpg"
    },
    {
      id: "Y974LwW3f0M",
      title: "Nadodikkattu - CID Dasan and Vijayan Best Comedy Scene",
      thumbnail: "https://img.youtube.com/vi/Y974LwW3f0M/hqdefault.jpg"
    },
    {
      id: "x970N83bKlk",
      title: "Vellanakalude Nadu - Road Roller Repair Comedy Scene",
      thumbnail: "https://img.youtube.com/vi/x970N83bKlk/hqdefault.jpg"
    },
    {
      id: "7QnKzF90yMs",
      title: "Pandippada - Salim Kumar Iconic Dialogue Scenes",
      thumbnail: "https://img.youtube.com/vi/7QnKzF90yMs/hqdefault.jpg"
    },
    {
      id: "k99mS8qQWQE",
      title: "Pulival Kalyanam - Manavalan & Dharmendra Comedy Scene",
      thumbnail: "https://img.youtube.com/vi/k99mS8qQWQE/hqdefault.jpg"
    },
    {
      id: "J883_yT-2mM",
      title: "Punjabi House - Harisree Ashokan & Dileep Comedy Scene",
      thumbnail: "https://img.youtube.com/vi/J883_yT-2mM/hqdefault.jpg"
    },
    {
      id: "8R9R8qZ2k1U",
      title: "Thenmavin Kombath - Pappu Ippol Sariyakkitharam Scene",
      thumbnail: "https://img.youtube.com/vi/8R9R8qZ2k1U/hqdefault.jpg"
    },
    {
      id: "542tXbI8DNE",
      title: "Akkare Akkare Akkare - Dasan Vijayan America Scene",
      thumbnail: "https://img.youtube.com/vi/542tXbI8DNE/hqdefault.jpg"
    }
  ]
};

// Helper: Generate hash key for caching
function getCacheHash(text, style = 'Funny') {
  return crypto.createHash('md5').update(`${text}_${style}`).digest('hex');
}

// Helper: Fetch natural Malayalam audio from TTS service or Google TTS fallback
async function generateMalayalamTTS(text, style = 'Funny') {
  const ttsApiKey = process.env.TTS_API_KEY;

  if (ttsApiKey && ttsApiKey !== 'YOUR_KEY') {
    try {
      // Optional Google Cloud TTS or external natural TTS endpoint if API key provided
      const googleTtsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsApiKey}`;
      
      // Pitch/speakingRate adjustments per voice style
      let speakingRate = 1.0;
      let pitch = 0.0;
      if (style === 'Funny') { speakingRate = 1.05; pitch = 1.5; }
      else if (style === 'Casual') { speakingRate = 0.95; pitch = 0.0; }
      else if (style === 'Dramatic') { speakingRate = 0.85; pitch = -1.0; }
      else if (style === 'Excited') { speakingRate = 1.15; pitch = 2.0; }

      const response = await fetch(googleTtsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'ml-IN', name: 'ml-IN-Wavenet-C' },
          audioConfig: { audioEncoding: 'MP3', speakingRate, pitch }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioContent) {
          return Buffer.from(data.audioContent, 'base64');
        }
      }
    } catch (err) {
      console.warn('[MalayaliOS TTS Backend] Cloud TTS API key failed, falling back to natural speech stream:', err.message);
    }
  }

  // Primary natural Malayalam TTS stream generator
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ml&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!res.ok) {
    throw new Error(`TTS provider returned HTTP ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// POST /api/tts - Backend Text-To-Speech endpoint with caching
app.post('/api/tts', async (req, res) => {
  const { text, style = 'Funny' } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid text parameter' });
  }

  const hash = getCacheHash(text, style);
  const cacheFilePath = path.join(cacheDir, `${hash}.mp3`);
  const audioUrl = `/audio/cache/${hash}.mp3`;

  // 1. Check local server cache
  if (fs.existsSync(cacheFilePath)) {
    console.log(`[MalayaliOS TTS] Cache hit for dialogue: "${text.slice(0, 30)}..." (${hash}.mp3)`);
    return res.json({ success: true, audioUrl, cached: true });
  }

  // 2. Generate natural audio via backend
  try {
    console.log(`[MalayaliOS TTS] Generating natural Malayalam audio for: "${text.slice(0, 30)}..." [Style: ${style}]`);
    const audioBuffer = await generateMalayalamTTS(text, style);

    // Save to server cache
    fs.writeFileSync(cacheFilePath, audioBuffer);
    console.log(`[MalayaliOS TTS] Audio generated and cached successfully as ${hash}.mp3`);

    return res.json({ success: true, audioUrl, cached: false });
  } catch (err) {
    console.error('[MalayaliOS TTS] Generation error:', err.message);
    return res.status(500).json({ error: 'Failed to generate natural TTS audio', details: err.message });
  }
});

// Pre-generate and cache common MalayaliOS dialogues on server startup
const COMMON_DIALOGUES = [
  "എടാ... ബാറ്ററി ഇരുപത് ശതമാനം മാത്രമേ ഉള്ളൂ!",
  "ചാർജർ എടുക്കെടാ... ബാറ്ററി തീരാറായി!",
  "അയ്യോ... പണി പാളി! ബാറ്ററി തീരാൻ പോവാ!",
  "ഇനി ഞാൻ അധികം നേരം നിൽക്കില്ല കേട്ടോ!",
  "ശരി... ഞാൻ പോകുവാ.",
  "ഇത്ര പെട്ടെന്ന് അടച്ചോ?",
  "അത് മതി... ഇനി അടുത്തത് നോക്ക്.",
  "Video കഴിഞ്ഞു... ഇനി എന്താ പരിപാടി?",
  "ശരി... ഒളിപ്പിച്ചോ.",
  "ഞാൻ ഇവിടെ തന്നെ ഉണ്ടേ.",
  "അയ്യോ... പണി പാളി!",
  "ഇത് എന്താ സംഭവിച്ചത്?",
  "MalayaliOS തുടങ്ങുന്നു... സിസ്റ്റം റെഡി.",
  "ശരി... ഞാൻ ഇറങ്ങുവാ.",
  "ചായ റെഡി!",
  "എനിക്കും അറിയില്ല.",
  "ഇതിന് ഞാൻ എന്ത് പറയാനാ?",
  "എടാ... ഭൂമി കുലുങ്ങുന്നുണ്ടല്ലോ!",
  "പേടിക്കണ്ട... ഇത് MalayaliOS ആണ്.",
  "മഴ തുടങ്ങി... ചായ എടുക്കാം!",
  "മഴ കനക്കുന്നു... കുട എടുത്തോ!",
  "എല്ലാം പറത്തിക്കൊണ്ടുപോകുന്നുണ്ട്!",
  "എന്തൊക്കെയാ ഇവിടെ നടക്കുന്നത്?",
  "ശുഭ രാത്രി... പക്ഷേ ഉറങ്ങണ്ട.",
  "മഴ കഴിഞ്ഞു. ഇനി rainbow കാണാം.",
  "അത് ഇവിടെ ഇല്ല.",
  "കിട്ടിയില്ല.",
  "ഇനി നോക്കണ്ട.",
  "എന്നെ എന്തിനാ കളഞ്ഞത്? 😭",
  "അയ്യോ... എല്ലാം പോയി!",
  "ഇവിടെ ആരും safe അല്ല.",
  "ഇവിടെ ഒന്നുമില്ല.",
  "കുറച്ച് പതുക്കെ ഓടിക്കെടാ.",
  "Formula 1 ആണോ കളിക്കുന്നത്?",
  "എനിക്ക് ശ്വാസം മുട്ടുന്നു.",
  "ഒരുത്തൻ എങ്കിലും close ചെയ്യ്!",
  "ഇനി എന്തെങ്കിലും ചെയ്താൽ ഞാൻ പോകും.",
  "ഞാൻ ഒന്ന് പേടിപ്പിച്ചതാ.",
  "ഒരു minute...",
  "Thank you.",
  "ഇവിടെ ആരും പോകുന്നില്ല.",
  "Traffic cleared.",
  "Charger കണ്ടെത്താനായില്ല.",
  "ചാർജർ കൈയിൽ തന്നെയുണ്ട്.",
  "എവിടെയാ പഠിക്കുന്നത്?",
  "ജോലി കിട്ടിയോ?",
  "കല്യാണം നോക്കുന്നില്ലേ?",
  "ശരി... വെച്ചേക്കാം.",
  "Call rejected. അമ്മാവൻ വീണ്ടും വിളിക്കും.",
  "147 useless files found.",
  "Cleaned: 0 bytes. നിന്റെ computer ഇതിനകം clean ആണ്.",
  "System ചൂടാകുന്നു.",
  "എടാ... ഞാൻ biriyani അല്ല!",
  "കാക്ക എന്തോ കൊണ്ടുവന്നു.",
  "ആരോ നോക്കുന്നുണ്ടെന്ന് തോന്നുന്നില്ലേ?",
  "ആരും ഇല്ലെടാ."
];

async function pregenerateCommonDialogues() {
  console.log('[MalayaliOS TTS] Pre-generating common dialogues for fast response...');
  for (const text of COMMON_DIALOGUES) {
    try {
      const hash = getCacheHash(text, 'Funny');
      const cacheFilePath = path.join(cacheDir, `${hash}.mp3`);
      if (!fs.existsSync(cacheFilePath)) {
        const audioBuffer = await generateMalayalamTTS(text, 'Funny');
        fs.writeFileSync(cacheFilePath, audioBuffer);
      }
    } catch (e) {
      // Ignore individual pre-generation errors to avoid blocking server boot
    }
  }
  console.log('[MalayaliOS TTS] Dialogue pre-generation complete.');
}

// GET /api/playlist/:playlistId
app.get('/api/playlist/:playlistId', async (req, res) => {
  const { playlistId } = req.params;
  const apiKey = process.env.YOUTUBE_API_KEY;

  console.log(`[MalayaliOS Server] Playlist requested: ${playlistId}`);

  if (apiKey && apiKey !== 'YOUR_KEY') {
    try {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${playlistId}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.items && Array.isArray(data.items)) {
        const videos = data.items.map((item) => ({
          id: item.snippet?.resourceId?.videoId,
          title: item.snippet?.title || 'MalayaliOS Video',
          thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${item.snippet?.resourceId?.videoId}/hqdefault.jpg`
        })).filter((v) => v.id);

        if (videos.length > 0) {
          console.log(`[MalayaliOS Server] Returning ${videos.length} videos from YouTube API`);
          return res.json({ videos });
        }
      }
    } catch (err) {
      console.error('[MalayaliOS Server] YouTube API error:', err.message);
    }
  }

  // Fallback if API key is invalid or request fails
  console.log('[MalayaliOS Server] Returning curated fallback comedy videos');
  const fallback = FALLBACK_PLAYLIST_VIDEOS[playlistId] || FALLBACK_PLAYLIST_VIDEOS.default;
  return res.json({ videos: fallback });
});

// POST /api/videos/link - Save custom video link
app.post('/api/videos/link', (req, res) => {
  const { cardId, videoId, youtubeUrl } = req.body;
  if (!cardId || !videoId) {
    return res.status(400).json({ error: 'Missing cardId or videoId' });
  }
  customVideoLinksStore[cardId] = { videoId, youtubeUrl };
  console.log(`[MalayaliOS Server] Saved custom link for cardId ${cardId}: ${videoId}`);
  return res.json({ success: true, link: customVideoLinksStore[cardId] });
});

// POST /api/videos/add - Add new custom video
app.post('/api/videos/add', (req, res) => {
  const video = req.body;
  if (!video || !video.videoId) {
    return res.status(400).json({ error: 'Missing video or videoId' });
  }
  customAddedVideosStore.unshift(video);
  console.log(`[MalayaliOS Server] Added custom video: ${video.title} (${video.videoId})`);
  return res.json({ success: true, videos: customAddedVideosStore });
});

app.listen(PORT, () => {
  console.log(`[MalayaliOS Server] Express backend running at http://localhost:${PORT}`);
  pregenerateCommonDialogues();
});

