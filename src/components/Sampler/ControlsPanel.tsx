import { Metronome } from "./Metronome";
import { EffectsPanel } from "./EffectsPanel";
import { RecordingPanel } from "./RecordingPanel";

interface ControlsPanelProps {
  audioContext: AudioContext | null;
  reverbMix: number;
  onReverbMixChange: (mix: number) => void;
  dryGain: GainNode | null;
  wetGain: GainNode | null;
  isRecording: boolean;
  recordedEvents: { key: string; time: number }[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
}

/**
 * Controls panel component containing all control sections
 */
export const ControlsPanel = ({
  audioContext,
  reverbMix,
  onReverbMixChange,
  dryGain,
  wetGain,
  isRecording,
  recordedEvents,
  onStartRecording,
  onStopRecording,
  onPlayRecording
}: ControlsPanelProps) => {
  return (
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
      <EffectsPanel 
        reverbMix={reverbMix}
        onReverbMixChange={onReverbMixChange}
        dryGain={dryGain}
        wetGain={wetGain}
      />

      {/* Recording Section */}
      <RecordingPanel 
        isRecording={isRecording}
        recordedEvents={recordedEvents}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPlayRecording={onPlayRecording}
      />
    </div>
  );
}; 