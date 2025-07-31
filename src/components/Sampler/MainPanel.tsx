import { WaveformViewer } from "./WaveformViewer";
import { DrumPadsGrid } from "./DrumPadsGrid";

interface MainPanelProps {
  currentPlayingBuffer: AudioBuffer | null;
  isSoundPlaying: boolean;
  currentPlaybackTime: number;
  activeKeys: string[];
  onPadClick: (key: string) => void;
}

/**
 * Main panel component containing waveform viewer and drum pads
 */
export const MainPanel = ({
  currentPlayingBuffer,
  isSoundPlaying,
  currentPlaybackTime,
  activeKeys,
  onPadClick
}: MainPanelProps) => {
  return (
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
      <DrumPadsGrid 
        activeKeys={activeKeys}
        onPadClick={onPadClick}
      />
    </div>
  );
}; 