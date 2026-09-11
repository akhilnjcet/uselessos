import fs from 'fs';
import path from 'path';

function createSampleWav(filepath, durationSec = 1.0, freq = 440) {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataByteLength = numSamples * 2;
  const headerByteLength = 44;
  const buffer = Buffer.alloc(headerByteLength + dataByteLength);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const modFreq = freq + Math.sin(t * 14) * 50 + Math.sin(t * 28) * 25;
    const envelope = Math.sin(Math.PI * (i / numSamples));
    let sample = Math.sin(2 * Math.PI * modFreq * t) * 0.5 + Math.sin(4 * Math.PI * modFreq * t) * 0.25;
    sample *= envelope * 32767;
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, Math.floor(sample))), 44 + i * 2);
  }

  fs.writeFileSync(filepath, buffer);
}

const dir = path.resolve('./public/audio/dialogues');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const baseNames = [
  'battery-low-20', 'battery-low-10', 'battery-critical-5', 'battery-critical-1', 'battery-0',
  'app-close-01', 'app-close-02', 'app-close-03', 'app-close-04',
  'player-close-01', 'player-close-02', 'minimize-01', 'minimize-02',
  'error-01', 'error-02', 'startup-01', 'shutdown-01', 'chaaya-01',
  'useless-ai-01', 'useless-ai-02', 'earthquake-01', 'earthquake-02',
  'rain-01', 'rain-02', 'thunder-01', 'thunder-02', 'wind-01', 'chaos-01',
  'night-01', 'rainbow-01', 'common-sense-01', 'common-sense-02', 'common-sense-03', 'common-sense-04',
  'trash-delete-01', 'trash-empty-01', 'trash-multiple-01', 'trash-open-empty-01',
  'mouse-tired-01', 'mouse-tired-02', 'ram-panic-01', 'ram-panic-02', 'ram-panic-03', 'ram-panic-04',
  'dog-crossing-01', 'dog-thank-you-01', 'traffic-detected-01', 'traffic-cleared-01',
  'charger-not-found-01', 'charger-in-hand-01', 'ammavan-q1', 'ammavan-q2', 'ammavan-q3', 'ammavan-q4',
  'ammavan-rejected', 'cleaner-scanned', 'cleaner-cleaned', 'overheat-90', 'overheat-100',
  'crow-dropped', 'someone-watching-01', 'someone-watching-02'
];

let created = 0;
for (const base of baseNames) {
  const freq = 200 + Math.floor(Math.random() * 300);
  const dur = 0.8 + Math.random() * 0.8;
  
  // Create both .wav and .mp3 files
  createSampleWav(path.join(dir, `${base}.wav`), dur, freq);
  createSampleWav(path.join(dir, `${base}.mp3`), dur, freq);
  created += 2;
}

console.log(`Generated ${created} audio dialogue files (.wav and .mp3) in ${dir}`);
