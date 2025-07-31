import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Mic, PlayArrow, Stop } from "@mui/icons-material";
import { VSTMeter } from "../../components/Sampler/VSTMeter";
import { VSTButton } from "../../components/Sampler/VSTButton";
import { WaveformViewer } from "../../components/Sampler/WaveformViewer";
import { Metronome } from "../../components/Sampler/Metronome";
import { SAMPLES } from "../../constants/samplerConstants";

/**
 * Main sampler page component for the drum machine interface
 */
export const SamplerPage = () => {
  const [samples, setSamples] = useState<Record<string, AudioBuffer>>({});
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [convolver, setConvolver] = useState<ConvolverNode | null>(null);
  const [dryGain, setDryGain] = useState<GainNode | null>(null);
  const [wetGain, setWetGain] = useState<GainNode | null>(null);
  const [reverbMix, setReverbMix] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedEvents, setRecordedEvents] = useState<{ key: string; time: number }[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [currentPlayingBuffer, setCurrentPlayingBuffer] = useState<AudioBuffer | null>(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [playbackStartTime, setPlaybackStartTime] = useState<number | null>(null);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);

  /**
   * Play a sample with the given key
   */
  const playSample = (key: string) => {
    if (!audioContext || !samples[key] || !dryGain || !wetGain || !convolver) return;

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

  // Initialize audio context and effects
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

    // Load impulse response for reverb
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

  // Load samples and set up keyboard handlers
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

  /**
   * Start recording drum hits
   */
  const startRecording = () => {
    setRecordedEvents([]);
    setRecordingStartTime(performance.now());
    setIsRecording(true);
  };

  /**
   * Stop recording drum hits
   */
  const stopRecording = () => {
    setIsRecording(false);
    setRecordingStartTime(null);
  };

  /**
   * Play back recorded drum sequence
   */
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
    <div className="min-h-screen text-gray-800 p-8 w-screen"
         style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: "#e0e5ec" }}>
      
      {/* Neumorphic Header */}
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl p-6 mb-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
             style={{ backgroundColor: "#e0e5ec" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <PlayCircle className="text-[#4a5568]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" 
                    style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  TR-808 SAMPLER
                </h1>
                <p className="text-sm" 
                   style={{ color: "#718096", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  Professional Drum Machine VST
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <VSTMeter value={isSoundPlaying ? 0.8 : 0.1} label="OUT" />
              <VSTMeter value={isSoundPlaying ? 0.6 : 0.05} label="IN" />
            </div>
          </div>
        </div>

        {/* Main Neumorphic Interface */}
        <div className="rounded-3xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
             style={{ backgroundColor: "#e0e5ec" }}>
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Panel - Controls */}
            <div className="col-span-3 space-y-8">
              
              {/* Metronome Section */}
              <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <h3 className="text-sm mb-4 font-semibold" 
                    style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  METRONOME
                </h3>
                <Metronome audioContext={audioContext} />
              </div>

              {/* Effects Section */}
              <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <h3 className="text-sm mb-4 font-semibold" 
                    style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  EFFECTS
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" 
                          style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                      REVERB MIX
                    </span>
                    <span className="text-xs font-semibold" 
                          style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                      {Math.round(reverbMix * 100)}%
                    </span>
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
              <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <h3 className="text-sm mb-4 font-semibold" 
                    style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  RECORDING
                </h3>
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
              <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <WaveformViewer
                  audioBuffer={currentPlayingBuffer}
                  isPlaying={isSoundPlaying}
                  currentTime={currentPlaybackTime}
                  duration={currentPlayingBuffer?.duration || 0}
                />
              </div>

              {/* Drum Pads */}
              <div className="rounded-2xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
                   style={{ backgroundColor: "#e0e5ec" }}>
                <h3 className="text-sm mb-6 font-semibold" 
                    style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                  DRUM PADS
                </h3>
                <div className="grid grid-cols-4 gap-6">
                  {SAMPLES.map((sample) => (
                    <motion.div
                      key={sample.key}
                      className="relative"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.button
                        className="w-full h-28 rounded-2xl relative overflow-hidden shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
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
                          <div className="text-xs font-medium" 
                               style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                            {sample.name}
                          </div>
                          <div className="text-lg font-bold" 
                               style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                            {sample.key.toUpperCase()}
                          </div>
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
