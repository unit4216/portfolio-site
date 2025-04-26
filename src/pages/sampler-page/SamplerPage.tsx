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
import { Circle, PlayArrow, Stop } from "@mui/icons-material";
import { motion } from "framer-motion";

const SAMPLES = [
  { src: cowbell, key: "q" },
  { src: bass, key: "w" },
  { src: snare, key: "e" },
  { src: closedHat, key: "r" },
  { src: hiTom, key: "a" },
  { src: cymbal, key: "s" },
  { src: clap, key: "d" },
  { src: openHat, key: "f" },
];

export const Metronome = function ({
  audioContext,
}: {
  audioContext: AudioContext | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeClick, setIsMetronomeClick] = useState(false);
  const [bpm, setBpm] = useState(120);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
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
    <div className="flex flex-row items-center gap-4">
      <button onClick={toggleMetronome}>
        {isPlaying ? <Stop /> : <PlayArrow />}
      </button>
      <input
        type="text"
        value={bpm}
        readOnly
        onMouseDown={handleMouseDown}
        className="text-4xl w-24 text-center border border-gray-300 rounded-lg p-2 cursor-ns-resize select-none"
      />
      <div className="text-lg">BPM</div>
      <Circle sx={{ color: isMetronomeClick ? "red" : "gray" }} />
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

  const playSample = (key: string) => {
    if (!audioContext || !samples[key] || !dryGain || !wetGain || !convolver)
      return;

    const source = audioContext.createBufferSource();
    source.buffer = samples[key];

    source.connect(dryGain);
    source.connect(convolver);
    convolver.connect(wetGain);

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
  }, [audioContext, dryGain, wetGain, convolver, activeKeys, playSample]);

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
      className="text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5] flex flex-col items-center gap-y-8 h-full"
      style={{ fontFamily: "Neue Haas Grotesk" }}
    >
      <Metronome audioContext={audioContext} />
      <div className="flex flex-col items-center mb-8">
        <label className="mb-2">
          Reverb Mix: {Math.round(reverbMix * 100)}%
        </label>
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
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-4 w-fit gap-4 mx-auto">
        {SAMPLES.map((sample) => {
          return (
            <motion.button
              className={`relative bg-gray-200 hover:bg-gray-300 rounded-lg h-44 w-44`}
              onClick={() => {
                playSample(sample.key);
              }}
              // todo this should animate on mouse click as well...
              animate={{
                scale: activeKeys.includes(sample.key) ? 1.1 : 1,
                backgroundColor: activeKeys.includes(sample.key)
                  ? "#d1d5db"
                  : "#e5e7eb",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                backgroundColor: { duration: 0.2 },
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-row gap-4 mb-8">
        {!isRecording ? (
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={startRecording}
          >
            Record
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={stopRecording}
          >
            Stop
          </button>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={playRecording}
          disabled={recordedEvents.length === 0}
        >
          Play
        </button>
      </div>
    </div>
  );
};
