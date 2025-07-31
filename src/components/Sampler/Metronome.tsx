import { useEffect, useRef, useState } from "react";
import { Circle, PlayArrow, Stop } from "@mui/icons-material";
import { VSTButton } from "./VSTButton";

/**
 * Metronome component for drum machine timing
 */
interface MetronomeProps {
  audioContext: AudioContext | null;
}

export const Metronome = ({ audioContext }: MetronomeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeClick, setIsMetronomeClick] = useState(false);
  const [bpm, setBpm] = useState(120);
  const intervalId = useRef<number | null>(null);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startBpm = useRef(120);
  const [clickBuffer, setClickBuffer] = useState<AudioBuffer | null>(null);

  const metronomeClick = "/808-samples/Roland TR-808/RS/RS.WAV";

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
        <div className="text-xs mt-2 font-medium" 
             style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          BPM
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Circle sx={{ color: isMetronomeClick ? "#2d3748" : "#a0aec0", fontSize: 16 }} />
        <span className="text-xs font-medium" 
              style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          CLICK
        </span>
      </div>
    </div>
  );
}; 