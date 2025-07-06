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
import { Circle, PlayArrow, Stop, VolumeUp, Settings, Mic, PlayCircle } from "@mui/icons-material";
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

// VST-style Knob Component
const VSTKnob = ({ 
  value, 
  onChange, 
  label, 
  min = 0, 
  max = 100, 
  size = 60 
}: { 
  value: number; 
  onChange: (value: number) => void; 
  label: string; 
  min?: number; 
  max?: number; 
  size?: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startValue = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = startY.current - e.clientY;
    const sensitivity = (max - min) / 200;
    const newValue = Math.max(min, Math.min(max, startValue.current + deltaY * sensitivity));
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={knobRef}
        className="relative cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        style={{ width: size, height: size }}
      >
        <div 
          className="absolute inset-0 rounded-full border-2 shadow-inner"
          style={{ width: size, height: size, backgroundColor: "#d6ccc2", borderColor: "#d5bdaf" }}
        />
        <div 
          className="absolute inset-0 rounded-full border"
          style={{ 
            width: size - 8, 
            height: size - 8, 
            top: 4, 
            left: 4,
            transform: `rotate(${rotation}deg)`,
            backgroundColor: "#e3d5ca",
            borderColor: "#d5bdaf"
          }}
        />
        <div 
          className="absolute w-1 h-3 rounded-full"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-${size/2 - 8}px)`,
            transformOrigin: 'center',
            backgroundColor: "#8b4513"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono" style={{ color: "#8b4513" }}>
          {Math.round(value)}
        </div>
      </div>
      <div className="text-xs mt-2 text-center" style={{ color: "#a0522d" }}>{label}</div>
    </div>
  );
};

// VST-style Meter Component
const VSTMeter = ({ value, label }: { value: number; label: string }) => {
  const height = 80;
  const segments = 20;
  const segmentHeight = height / segments;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs mb-1" style={{ color: "#a0522d" }}>{label}</div>
      <div className="relative w-4 h-20 border rounded" style={{ backgroundColor: "#f5ebe0", borderColor: "#d5bdaf" }}>
        {Array.from({ length: segments }, (_, i) => {
          const segmentValue = (i + 1) / segments;
          const isActive = value >= segmentValue;
          const isPeak = i === segments - 1 && value >= 0.95;
          
          return (
            <div
              key={i}
              className={`w-full border-b`}
              style={{ 
                height: segmentHeight,
                borderColor: "#d5bdaf",
                backgroundColor: isPeak ? "#8b4513" : 
                isActive ? "#d5bdaf" : "#e3d5ca"
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
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
      style={{
        backgroundColor: variant === "primary" ? "#8b4513" : 
                       variant === "danger" ? "#a0522d" : "#d5bdaf",
        borderColor: variant === "primary" ? "#8b4513" : 
                    variant === "danger" ? "#a0522d" : "#d5bdaf"
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
    
    // Improved sampling for better resolution
    const step = samples / canvasWidth;
    const amp = canvasHeight / 2;

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    for (let i = 0; i < canvasHeight; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }

    // Draw waveform with improved resolution
    ctx.beginPath();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;

    for (let i = 0; i < canvasWidth; i++) {
      const dataIndex = Math.floor(i * step);
      const x = i;
      
      // Average multiple samples for smoother waveform
      let sum = 0;
      const samplesToAverage = Math.max(1, Math.floor(step));
      for (let j = 0; j < samplesToAverage && dataIndex + j < samples; j++) {
        sum += channelData[dataIndex + j] || 0;
      }
      const average = sum / samplesToAverage;
      
      const y = average * amp + amp;
      ctx.lineTo(x, y);
    }

    ctx.stroke();

    // Draw progress line
    if (isPlaying && duration > 0) {
      const progressX = (currentTime / duration) * canvasWidth;
      ctx.beginPath();
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 3;
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, canvasHeight);
      ctx.stroke();
    }
  }, [audioBuffer, isPlaying, currentTime, duration]);

  return (
    <div className="w-full border rounded-lg p-4" style={{ backgroundColor: "#f5ebe0", borderColor: "#d5bdaf" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-mono" style={{ color: "#8b4513" }}>WAVEFORM</h3>
        {isPlaying && (
          <div className="text-xs font-mono" style={{ color: "#a0522d" }}>
            {Math.floor(currentTime * 1000)}ms / {Math.floor(duration * 1000)}ms
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-32 border rounded"
        style={{ backgroundColor: "#edede9", borderColor: "#d5bdaf" }}
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

    intervalId.current = setInterval(() => {
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
    <div className="flex items-center gap-4 border rounded-lg p-4" style={{ backgroundColor: "#e3d5ca", borderColor: "#d5bdaf" }}>
      <VSTButton onClick={toggleMetronome} size="small">
        {isPlaying ? <Stop fontSize="small" /> : <PlayArrow fontSize="small" />}
      </VSTButton>
      <div className="flex flex-col items-center">
        <input
          type="text"
          value={bpm}
          readOnly
          onMouseDown={handleMouseDown}
          className="text-2xl w-16 text-center rounded font-mono cursor-ns-resize select-none"
          style={{ backgroundColor: "#f5ebe0", color: "#8b4513", borderColor: "#d5bdaf" }}
        />
        <div className="text-xs mt-1" style={{ color: "#a0522d" }}>BPM</div>
      </div>
      <div className="flex items-center gap-2">
        <Circle sx={{ color: isMetronomeClick ? "#8b4513" : "#d5bdaf", fontSize: 16 }} />
        <span className="text-xs" style={{ color: "#a0522d" }}>CLICK</span>
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
      style={{ fontFamily: "Neue Haas Grotesk", backgroundColor: "#edede9" }}
    >
      {/* VST Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-t-lg p-4" style={{ backgroundColor: "#d6ccc2", borderColor: "#d5bdaf" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#d5bdaf" }}>
                <PlayCircle className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-mono font-bold" style={{ color: "#8b4513" }}>TR-808 SAMPLER</h1>
                <p className="text-xs" style={{ color: "#a0522d" }}>Professional Drum Machine VST</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VSTMeter value={isSoundPlaying ? 0.8 : 0.1} label="OUT" />
              <VSTMeter value={isSoundPlaying ? 0.6 : 0.05} label="IN" />
            </div>
          </div>
        </div>

        {/* Main VST Interface */}
        <div className="bg-gray-900 border-x border-b border-gray-700 rounded-b-lg p-6" style={{ backgroundColor: "#f5ebe0", borderColor: "#d5bdaf" }}>
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Controls */}
            <div className="col-span-3 space-y-6">
              {/* Metronome Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4" style={{ backgroundColor: "#e3d5ca", borderColor: "#d5bdaf" }}>
                <h3 className="text-sm font-mono mb-3" style={{ color: "#8b4513" }}>METRONOME</h3>
                <Metronome audioContext={audioContext} />
              </div>

              {/* Effects Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4" style={{ backgroundColor: "#e3d5ca", borderColor: "#d5bdaf" }}>
                <h3 className="text-sm font-mono mb-3" style={{ color: "#8b4513" }}>EFFECTS</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#a0522d" }}>REVERB MIX</span>
                    <span className="text-xs font-mono" style={{ color: "#8b4513" }}>{Math.round(reverbMix * 100)}%</span>
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
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `#d5bdaf`
                    }}
                  />
                </div>
              </div>

              {/* Recording Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4" style={{ backgroundColor: "#e3d5ca", borderColor: "#d5bdaf" }}>
                <h3 className="text-sm font-mono mb-3" style={{ color: "#8b4513" }}>RECORDING</h3>
                <div className="space-y-2">
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
            <div className="col-span-9 space-y-6">
              {/* Waveform Viewer */}
              <WaveformViewer
                audioBuffer={currentPlayingBuffer}
                isPlaying={isSoundPlaying}
                currentTime={currentPlaybackTime}
                duration={currentPlayingBuffer?.duration || 0}
              />

              {/* Drum Pads */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6" style={{ backgroundColor: "#e3d5ca", borderColor: "#d5bdaf" }}>
                <h3 className="text-sm font-mono mb-4" style={{ color: "#8b4513" }}>DRUM PADS</h3>
                <div className="grid grid-cols-4 gap-4">
                  {SAMPLES.map((sample) => (
                    <motion.div
                      key={sample.key}
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.button
                        className={`w-full h-24 border-2 rounded-lg shadow-lg relative overflow-hidden`}
                        style={{ backgroundColor: "#d6ccc2", borderColor: "#d5bdaf" }}
                        onClick={() => playSample(sample.key)}
                        animate={{
                          scale: activeKeys.includes(sample.key) ? 1.05 : 1,
                          borderColor: activeKeys.includes(sample.key) ? "#8b4513" : "#d5bdaf",
                          backgroundColor: activeKeys.includes(sample.key) 
                            ? "#d5bdaf" 
                            : "#d6ccc2"
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {/* Pad Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-xs font-mono" style={{ color: "#a0522d" }}>{sample.name}</div>
                          <div className="text-lg font-mono font-bold" style={{ color: "#8b4513" }}>{sample.key.toUpperCase()}</div>
                        </div>

                        {/* Active Indicator */}
                        {activeKeys.includes(sample.key) && (
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundColor: "#8b4513" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
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
