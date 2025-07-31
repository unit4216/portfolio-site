import { useEffect, useState } from "react";
import { SAMPLES } from "../constants/samplerConstants";

/**
 * Custom hook for managing sampler audio state and logic
 */
export const useSamplerAudio = () => {
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

  /**
   * Update reverb mix
   */
  const updateReverbMix = (mix: number) => {
    setReverbMix(mix);
    if (dryGain && wetGain) {
      dryGain.gain.value = 1 - mix;
      wetGain.gain.value = mix;
    }
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
  }, [audioContext, dryGain, wetGain, convolver, activeKeys, isSoundPlaying, playbackStartTime, isRecording, recordingStartTime]);

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

  return {
    // State
    samples,
    activeKeys,
    audioContext,
    reverbMix,
    isRecording,
    recordedEvents,
    currentPlayingBuffer,
    isSoundPlaying,
    currentPlaybackTime,
    dryGain,
    wetGain,
    
    // Actions
    playSample,
    startRecording,
    stopRecording,
    playRecording,
    updateReverbMix,
  };
}; 