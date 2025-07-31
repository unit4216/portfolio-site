import cowbell from "../../assets/808-samples/Roland TR-808/CB/CB.wav";
import bass from "../../assets/808-samples/Roland TR-808/BD/BD0000.wav";
import snare from "../../assets/808-samples/Roland TR-808/SD/SD0010.wav";
import closedHat from "../../assets/808-samples/Roland TR-808/CH/CH.wav";
import hiTom from "../../assets/808-samples/Roland TR-808/HT/HT00.wav";
import cymbal from "../../assets/808-samples/Roland TR-808/CY/CY0000.wav";
import clap from "../../assets/808-samples/Roland TR-808/CP/CP.wav";
import openHat from "../../assets/808-samples/Roland TR-808/OH/OH00.wav";

import { useEffect, useRef, useState } from "react";
import metronomeClick from "../../assets/808-samples/Roland TR-808/RS/RS.wav";
import { Circle, PlayArrow, Stop, Mic, PlayCircle } from "@mui/icons-material";
import { motion } from "framer-motion";

const SAMPLES = [
  { src: cowbell, key: "q", name: "Cowbell" },
  { src: bass, key: "w", name: "Bass" },
  { src: snare, key: "e", name: "Snare" },
  { src: closedHat, key: "r", name: "Closed Hat" },
  { src: hiTom, key: "a", name: "Hi Tom" },
  { src: cymbal, key: "s", name: "Cymbal" },
  { src: clap, key: "d", name: "Clap" },
  { src: openHat, key: "f", name: "Open Hat" },
];


// VST-style Meter Component
const VSTMeter = ({ value, label }: { value: number; label: string }) => {
  const height = 80;
  const segments = 20;
  const segmentHeight = height / segments;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs mb-1 font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>{label}</div>
      <div className="relative w-4 h-20 rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
        {Array.from({ length: segments }, (_, i) => {
          const segmentValue = (i + 1) / segments;
          const isActive = value >= segmentValue;
          const isPeak = i === segments - 1 && value >= 0.95;
          
          return (
            <div
              key={i}
              className={`w-full border-b border-gray-300`}
              style={{ 
                height: segmentHeight,
                backgroundColor: isPeak ? "#2d3748" : 
                isActive ? "#a0aec0" : "#e0e5ec"
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// VST-style Button Component
const VSTButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "medium",
  disabled = false,
  className = ""
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = "font-mono font-bold border-2 rounded transition-all duration-200 select-none";
  const sizeClasses = {
    small: "px-3 py-1 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };
  const variantClasses = {
    primary: "hover:bg-opacity-80 text-white",
    secondary: "hover:bg-opacity-80 text-gray-800",
    danger: "hover:bg-opacity-80 text-white"
  };
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className} rounded-xl shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]`}
      style={{
        backgroundColor: variant === "primary" ? "#2d3748" : 
                       variant === "danger" ? "#e53e3e" : "#e0e5ec",
        borderColor: variant === "primary" ? "#2d3748" : 
                    variant === "danger" ? "#e53e3e" : "#e0e5ec",
        color: variant === "primary" ? "#ffffff" : 
               variant === "danger" ? "#ffffff" : "#2d3748"
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Waveform Viewer Component
const WaveformViewer = ({ 
  audioBuffer, 
  isPlaying, 
  currentTime, 
  duration 
}: { 
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the context to match the device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Set canvas display size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Get audio data
    const channelData = audioBuffer.getChannelData(0);
    const samples = channelData.length;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Draw background
    ctx.fillStyle = '#e0e5ec'; // Neumorphic background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(160, 174, 192, 0.2)'; // Modern gray with opacity
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < canvasWidth; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < canvasHeight; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }

    // Draw waveform
    const step = Math.ceil(samples / canvasWidth);
    const amp = (canvasHeight / 2) * 0.9; // Slightly smaller amplitude for aesthetics
    
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    
    // Draw the waveform
    for (let i = 0; i < canvasWidth; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      // Create gradient for waveform using modern colors
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, 'rgba(45, 55, 72, 0.8)'); // Dark gray with opacity
      gradient.addColorStop(1, 'rgba(74, 85, 104, 0.6)'); // Medium gray with opacity
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      
      const x = i;
      const y = (1 + min) * amp;
      // const y2 = (1 + max) * amp;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Complete the waveform path
    ctx.stroke();

    // Draw playhead if playing
    if (isPlaying && duration > 0) {
      const playheadX = (currentTime / duration) * canvasWidth;
      
      // Draw playhead line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(45, 55, 72, 0.8)'; // Dark gray with opacity
      ctx.lineWidth = 2;
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();
      
      // Draw playhead glow
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(45, 55, 72, 0.2)';
      ctx.lineWidth = 6;
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();
    }
  }, [audioBuffer, isPlaying, currentTime, duration]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>WAVEFORM</h3>
        {isPlaying && (
          <div className="text-xs font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {Math.floor(currentTime * 1000)}ms / {Math.floor(duration * 1000)}ms
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded-xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
        style={{ backgroundColor: "#e0e5ec" }}
      />
    </div>
  );
};

export const Metronome = function ({
  audioContext,
}: {
  audioContext: AudioContext | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeClick, setIsMetronomeClick] = useState(false);
  const [bpm, setBpm] = useState(120);
  const intervalId = useRef<number | null>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startBpm = useRef(120);
  const [clickBuffer, setClickBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    if (!audioContext) return;

    fetch(metronomeClick)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((decoded) => setClickBuffer(decoded));
  }, [audioContext]);

  const playClick = () => {
    if (!audioContext || !clickBuffer) return;
    const source = audioContext.createBufferSource();
    source.buffer = clickBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const startMetronome = () => {
    const interval = (60 / bpm) * 1000;

    intervalId.current = window.setInterval(() => {
      playClick();

      setIsMetronomeClick(true);
      setTimeout(() => {
        setIsMetronomeClick(false);
      }, 100);
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const toggleMetronome = () => {
    if (audioContext?.state === "suspended") {
      audioContext.resume();
    }

    if (isPlaying) {
      stopMetronome();
      setIsPlaying(false);
    } else {
      startMetronome();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm]);

  const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    dragging.current = true;
    startY.current = e.clientY;
    startBpm.current = bpm;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current) {
      const deltaY = startY.current - e.clientY;
      const sensitivity = 0.5;

      let newBpm = startBpm.current + deltaY * sensitivity;
      newBpm = Math.max(30, Math.min(300, newBpm));
      setBpm(Math.round(newBpm));
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex items-center gap-6">
      <VSTButton onClick={toggleMetronome} size="small">
        {isPlaying ? <Stop fontSize="small" /> : <PlayArrow fontSize="small" />}
      </VSTButton>
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={bpm}
          readOnly
          onMouseDown={handleMouseDown}
          className="text-2xl w-16 text-center rounded-xl cursor-ns-resize select-none shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
          style={{ backgroundColor: "#e0e5ec", color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
        />
        <div className="text-xs mt-2 font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>BPM</div>
      </div>
      <div className="flex items-center gap-2">
        <Circle sx={{ color: isMetronomeClick ? "#2d3748" : "#a0aec0", fontSize: 16 }} />
        <span className="text-xs font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>CLICK</span>
      </div>
    </div>
  );
};

export const SamplerPage = function () {
  const [samples, setSamples] = useState<Record<string, AudioBuffer>>({});
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [convolver, setConvolver] = useState<ConvolverNode | null>(null);
  const [dryGain, setDryGain] = useState<GainNode | null>(null);
  const [wetGain, setWetGain] = useState<GainNode | null>(null);
  const [reverbMix, setReverbMix] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedEvents, setRecordedEvents] = useState<
    { key: string; time: number }[]
  >([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null,
  );
  const [currentPlayingBuffer, setCurrentPlayingBuffer] = useState<AudioBuffer | null>(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [playbackStartTime, setPlaybackStartTime] = useState<number | null>(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);

  const playSample = (key: string) => {
    if (!audioContext || !samples[key] || !dryGain || !wetGain || !convolver)
      return;

    const source = audioContext.createBufferSource();
    source.buffer = samples[key];

    source.connect(dryGain);
    source.connect(convolver);
    convolver.connect(wetGain);

    // Track the currently playing sound for waveform display
    setCurrentPlayingBuffer(samples[key]);
    setIsSoundPlaying(true);
    setPlaybackStartTime(audioContext.currentTime);
    setCurrentPlaybackTime(0);

    source.onended = () => {
      setIsSoundPlaying(false);
      setCurrentPlayingBuffer(null);
    };

    source.start(0);
  };

  useEffect(() => {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(ctx);

    const conv = ctx.createConvolver();
    setConvolver(conv);

    const dry = ctx.createGain();
    const wet = ctx.createGain();
    dry.connect(ctx.destination);
    wet.connect(ctx.destination);

    dry.gain.value = 1;
    wet.gain.value = 0;

    setDryGain(dry);
    setWetGain(wet);

    fetch("./impulse.wav")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decodedAudio) => {
        conv.buffer = decodedAudio;
      });

    return () => {
      ctx.close();
    };
  }, []);

  useEffect(() => {
    if (!audioContext || !dryGain || !wetGain || !convolver) return;

    const loadSamples = async () => {
      const loadedBuffers: Record<string, AudioBuffer> = {};

      for (const sample of SAMPLES) {
        const response = await fetch(sample.src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        loadedBuffers[sample.key] = audioBuffer;
      }

      setSamples(loadedBuffers);
    };

    loadSamples();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      playSample(key);
      setActiveKeys((prev) => {
        if (!prev.includes(key)) return [...prev, key];
        return prev;
      });

      if (isRecording && recordingStartTime !== null) {
        const currentTime = performance.now();
        setRecordedEvents((prev) => [
          ...prev,
          { key, time: currentTime - recordingStartTime },
        ]);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys((prev) => prev.filter((k) => k !== key));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [audioContext, dryGain, wetGain, convolver, activeKeys, isSoundPlaying, playbackStartTime]);

  // Update playback time when sound is playing
  useEffect(() => {
    if (!isSoundPlaying || !audioContext || playbackStartTime === null) return;

    const updateTime = () => {
      const elapsed = audioContext.currentTime - playbackStartTime;
      setCurrentPlaybackTime(elapsed);
      
      if (elapsed < (currentPlayingBuffer?.duration || 0)) {
        requestAnimationFrame(updateTime);
      } else {
        setIsSoundPlaying(false);
        setCurrentPlayingBuffer(null);
      }
    };

    const animationId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationId);
  }, [isSoundPlaying, audioContext, playbackStartTime, currentPlayingBuffer]);

  const startRecording = () => {
    setRecordedEvents([]);
    setRecordingStartTime(performance.now());
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingStartTime(null);
  };

  const playRecording = () => {
    if (recordedEvents.length === 0) return;

    recordedEvents.forEach(({ key, time }) => {
      setTimeout(() => {
        playSample(key);
        setActiveKeys((prev) => [...prev, key]);
        setTimeout(() => {
          setActiveKeys((prev) => prev.filter((k) => k !== key));
        }, 100);
      }, time);
    });
  };

  return (
    <div
      className="min-h-screen text-gray-800 p-8 w-screen"
      style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: "#e0e5ec" }}
    >
      {/* Neumorphic Header */}
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl p-6 mb-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                <PlayCircle className="text-[#4a5568]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>TR-808 SAMPLER</h1>
                <p className="text-sm" style={{ color: "#718096", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>Professional Drum Machine VST</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <VSTMeter value={isSoundPlaying ? 0.8 : 0.1} label="OUT" />
              <VSTMeter value={isSoundPlaying ? 0.6 : 0.05} label="IN" />
            </div>
          </div>
        </div>

        {/* Main Neumorphic Interface */}
        <div className="rounded-3xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                      <div className="grid grid-cols-12 gap-8">
              {/* Left Panel - Controls */}
              <div className="col-span-3 space-y-8">
                {/* Metronome Section */}
                <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                  <h3 className="text-sm mb-4 font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>METRONOME</h3>
                  <Metronome audioContext={audioContext} />
                </div>

                {/* Effects Section */}
                <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                  <h3 className="text-sm mb-4 font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>EFFECTS</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>REVERB MIX</span>
                      <span className="text-xs font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>{Math.round(reverbMix * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={reverbMix}
                      onChange={(e) => {
                        const mix = parseFloat(e.target.value);
                        setReverbMix(mix);

                        if (dryGain && wetGain) {
                          dryGain.gain.value = 1 - mix;
                          wetGain.gain.value = mix;
                        }
                      }}
                      className="w-full h-3 rounded-xl appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #a0aec0 0%, #a0aec0 ${reverbMix * 100}%, #e0e5ec ${reverbMix * 100}%, #e0e5ec 100%)`,
                        boxShadow: 'inset 2px 2px 5px rgba(163,177,198,0.6), inset -2px -2px 5px rgba(255,255,255,0.8)'
                      }}
                    />
                  </div>
                </div>

                {/* Recording Section */}
                <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                  <h3 className="text-sm mb-4 font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>RECORDING</h3>
                  <div className="space-y-3">
                    {!isRecording ? (
                      <VSTButton onClick={startRecording} variant="primary" size="small" className="w-full">
                        <Mic fontSize="small" className="mr-2" />
                        RECORD
                      </VSTButton>
                    ) : (
                      <VSTButton onClick={stopRecording} variant="danger" size="small" className="w-full">
                        <Stop fontSize="small" className="mr-2" />
                        STOP
                      </VSTButton>
                    )}
                    
                    <VSTButton 
                      onClick={playRecording} 
                      variant="secondary" 
                      size="small" 
                      disabled={recordedEvents.length === 0}
                      className="w-full"
                    >
                      <PlayArrow fontSize="small" className="mr-2" />
                      PLAY
                    </VSTButton>
                  </div>
                </div>
              </div>

            {/* Center Panel - Waveform and Pads */}
            <div className="col-span-9 space-y-8">
              {/* Waveform Viewer */}
              <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                <WaveformViewer
                  audioBuffer={currentPlayingBuffer}
                  isPlaying={isSoundPlaying}
                  currentTime={currentPlaybackTime}
                  duration={currentPlayingBuffer?.duration || 0}
                />
              </div>

              {/* Drum Pads */}
              <div className="rounded-2xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" style={{ backgroundColor: "#e0e5ec" }}>
                <h3 className="text-sm mb-6 font-semibold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>DRUM PADS</h3>
                <div className="grid grid-cols-4 gap-6">
                  {SAMPLES.map((sample) => (
                    <motion.div
                      key={sample.key}
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.button
                        className={`w-full h-28 rounded-2xl relative overflow-hidden shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]`}
                        style={{ backgroundColor: "#e0e5ec" }}
                        onClick={() => playSample(sample.key)}
                        animate={{
                          scale: activeKeys.includes(sample.key) ? 1.05 : 1,
                          boxShadow: activeKeys.includes(sample.key) 
                            ? 'inset 2px 2px 5px rgba(163,177,198,0.6), inset -2px -2px 5px rgba(255,255,255,0.8)'
                            : '2px 2px 5px rgba(163,177,198,0.6), -2px -2px 5px rgba(255,255,255,0.8)'
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {/* Pad Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-xs font-medium" style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>{sample.name}</div>
                          <div className="text-lg font-bold" style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>{sample.key.toUpperCase()}</div>
                        </div>

                        {/* Active Indicator */}
                        {activeKeys.includes(sample.key) && (
                          <motion.div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundColor: "#2d3748" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
