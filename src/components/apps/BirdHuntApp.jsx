import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Camera as CameraIcon, RefreshCw, Zap } from 'lucide-react';

export const BirdHuntApp = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [score, setScore] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState(null);

  const scoreRef = useRef(0);
  scoreRef.current = score;

  useEffect(() => {
    let animFrameId = null;
    let cameraInstance = null;
    let handsInstance = null;

    let birds = [];
    let particles = [];
    let crosshair = { x: -100, y: -100 };
    let canShoot = true;
    let frameCount = 0;

    // Web Audio Synthesizer for Gunshot sound
    let audioCtx = null;
    const getAudioCtx = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    };

    const playGunshotSound = () => {
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (err) {
        console.error('Audio error:', err);
      }
    };

    // --- Bird Class ---
    class Bird {
      constructor(canvasWidth, canvasHeight, currentScore) {
        this.radius = 24;
        this.fromLeft = Math.random() > 0.5;
        this.x = this.fromLeft ? -50 : canvasWidth + 50;
        this.y = Math.random() * (canvasHeight - 250) + 50;

        // Dynamic speed scaling: starts from minimum 1.5x, increases continuously based on score
        const currentMultiplier = Math.min(5.0, 1.5 + (currentScore / 20) * 0.3);
        const baseSpeed = Math.random() * 1.0 + 1.5; // Starts at minimum 1.5 speed

        this.speed = baseSpeed * currentMultiplier * (this.fromLeft ? 1 : -1);
        this.wingAngle = 0;
        this.wingSpeed = 0.12 * Math.min(2.5, currentMultiplier);
        this.color = `hsl(${Math.random() * 60 + 10}, 80%, 50%)`;
      }

      update() {
        // Slight dynamic acceleration as the bird flies
        this.x += this.speed;
        this.wingAngle += this.wingSpeed;
      }

      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (!this.fromLeft) ctx.scale(-1, 1);

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius, this.radius * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(this.radius * 0.7, -5, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.moveTo(this.radius * 1.1, -5);
        ctx.lineTo(this.radius * 1.5, -2);
        ctx.lineTo(this.radius * 1.1, 2);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.radius * 0.8, -7, 3, 0, Math.PI * 2);
        ctx.fill();

        // Flapping Wing
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        const wingY = Math.sin(this.wingAngle) * 15;
        ctx.beginPath();
        ctx.ellipse(-5, wingY, 14, 7, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // --- Particle Class ---
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 5 + 3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.03;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // --- Shoot Action ---
    const shoot = (canvas, ctx) => {
      playGunshotSound();

      // Screen Flash / Muzzle Flash
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Check hits
      for (let i = birds.length - 1; i >= 0; i--) {
        const b = birds[i];
        const dist = Math.hypot(b.x - crosshair.x, b.y - crosshair.y);
        if (dist < b.radius + 20) {
          for (let p = 0; p < 15; p++) {
            particles.push(new Particle(b.x, b.y, b.color));
          }
          birds.splice(i, 1);
          setScore((prev) => {
            const nextScore = prev + 10;
            // Update speed multiplier state starting from 1.5x minimum
            setSpeedMultiplier((1.5 + (nextScore / 20) * 0.3).toFixed(1));
            return nextScore;
          });
          break;
        }
      }
    };

    // --- Draw Crosshair ---
    const drawCrosshair = (ctx) => {
      if (crosshair.x < 0 || crosshair.y < 0) return;

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.arc(crosshair.x, crosshair.y, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(crosshair.x, crosshair.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(crosshair.x - 30, crosshair.y);
      ctx.lineTo(crosshair.x - 10, crosshair.y);
      ctx.moveTo(crosshair.x + 10, crosshair.y);
      ctx.lineTo(crosshair.x + 30, crosshair.y);
      ctx.moveTo(crosshair.x, crosshair.y - 30);
      ctx.lineTo(crosshair.x, crosshair.y - 10);
      ctx.moveTo(crosshair.x, crosshair.y + 10);
      ctx.lineTo(crosshair.x, crosshair.y + 30);
      ctx.stroke();
    };

    // Load External Scripts dynamically
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    let isMounted = true;

    const initGame = async () => {
      try {
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

        if (!isMounted) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');

        // Main Animation Loop
        const gameLoop = () => {
          if (!isMounted || !canvas) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          frameCount++;
          // Spawn interval decreases slightly as score increases to add intensity
          const spawnInterval = Math.max(45, 80 - Math.floor(scoreRef.current / 30) * 5);
          if (frameCount % spawnInterval === 0 && birds.length < 7) {
            birds.push(new Bird(canvas.width, canvas.height, scoreRef.current));
          }

          for (let i = birds.length - 1; i >= 0; i--) {
            birds[i].update();
            birds[i].draw(ctx);
            if (birds[i].x < -100 || birds[i].x > canvas.width + 100) {
              birds.splice(i, 1);
            }
          }

          for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) particles.splice(i, 1);
          }

          drawCrosshair(ctx);
          animFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        // Setup MediaPipe Hands
        const { Hands, Camera } = window;
        if (!Hands || !Camera) {
          throw new Error('MediaPipe libraries failed to initialize.');
        }

        handsInstance = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        handsInstance.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.65,
          minTrackingConfidence: 0.65
        });

        handsInstance.onResults((results) => {
          setLoading(false);
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];

            crosshair.x = (1 - indexTip.x) * canvas.width;
            crosshair.y = indexTip.y * canvas.height;

            const pinchDistance = Math.hypot(
              (1 - indexTip.x) - (1 - thumbTip.x),
              indexTip.y - thumbTip.y
            );

            if (pinchDistance < 0.055) {
              if (canShoot) {
                shoot(canvas, ctx);
                canShoot = false;
              }
            } else {
              canShoot = true;
            }
          } else {
            crosshair.x = -100;
            crosshair.y = -100;
          }
        });

        cameraInstance = new Camera(video, {
          onFrame: async () => {
            if (video && handsInstance) {
              await handsInstance.send({ image: video });
            }
          },
          width: 640,
          height: 480
        });

        await cameraInstance.start();
      } catch (err) {
        console.error('Hand tracking error:', err);
        setCameraError(err.message || 'Failed to start camera or MediaPipe AI model.');
        setLoading(false);
      }
    };

    initGame();

    return () => {
      isMounted = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (cameraInstance) {
        try {
          cameraInstance.stop();
        } catch (e) {
          console.error('Camera stop error:', e);
        }
      }
      if (handsInstance) {
        try {
          handsInstance.close();
        } catch (e) {
          console.error('Hands close error:', e);
        }
      }
      if (audioCtx) {
        audioCtx.close();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-[#70c5ce] to-[#bee3db] overflow-hidden select-none font-sans border-4 border-slate-800 rounded-xl"
    >
      {/* Loading Overlay */}
      {loading && !cameraError && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30 text-white gap-3 animate-pulse">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
          <h3 className="text-xl font-bold text-slate-100">
            Loading Camera & AI Hand Tracker...
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Please allow camera permissions if prompted by your browser.
          </p>
        </div>
      )}

      {/* Camera Error Fallback */}
      {cameraError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-40 text-center p-6 space-y-4">
          <CameraIcon className="w-12 h-12 text-red-400 animate-bounce" />
          <h3 className="text-lg font-bold text-red-400">Camera Permission Required</h3>
          <p className="text-xs text-slate-300 max-w-sm">
            {cameraError}
          </p>
        </div>
      )}

      {/* Score & Speed Multiplier Header UI */}
      <div className="absolute top-4 left-4 z-20 text-white font-bold text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
        <div className="flex items-center gap-2">
          <Crosshair className="w-6 h-6 text-red-500" />
          <span>Score: <span className="text-amber-300 font-mono">{score}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 border-l border-white/20 pl-4">
          <Zap className="w-5 h-5 fill-current text-amber-400 animate-pulse" />
          <span>Speed: <span className="text-emerald-300 font-mono">{speedMultiplier}x</span></span>
        </div>
      </div>

      {/* Controls Instructions */}
      <div className="absolute bottom-4 left-4 z-20 text-xs text-slate-100 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20 shadow-lg space-y-1">
        <div>👉 <b>Aim:</b> Index Fingertip</div>
        <div>💥 <b>Shoot:</b> Pinch thumb & index finger together!</div>
        <div className="text-[10px] text-amber-300 font-mono">⚡ Birds speed up as score increases!</div>
      </div>

      {/* Webcam Feed Preview (Mirrored) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute bottom-4 right-4 w-48 h-32 object-cover border-2 border-white rounded-lg opacity-85 scale-x-[-1] z-10 shadow-2xl"
      />

      {/* Main Game Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={650}
        className="absolute inset-0 w-full h-full z-5"
      />
    </div>
  );
};
