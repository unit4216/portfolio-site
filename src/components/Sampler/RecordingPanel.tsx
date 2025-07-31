import { Mic, PlayArrow, Stop } from "@mui/icons-material";
import { VSTButton } from "./VSTButton";

interface RecordingPanelProps {
  isRecording: boolean;
  recordedEvents: { key: string; time: number }[];
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayRecording: () => void;
}

/**
 * Recording panel component with record controls
 */
export const RecordingPanel = ({ 
  isRecording, 
  recordedEvents, 
  onStartRecording, 
  onStopRecording, 
  onPlayRecording 
}: RecordingPanelProps) => {
  return (
    <div className="rounded-2xl p-6 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
         style={{ backgroundColor: "#e0e5ec" }}>
      <h3 className="text-sm mb-4 font-semibold" 
          style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        RECORDING
      </h3>
      <div className="space-y-3">
        {!isRecording ? (
          <VSTButton onClick={onStartRecording} variant="primary" size="small" className="w-full">
            <Mic fontSize="small" className="mr-2" />
            RECORD
          </VSTButton>
        ) : (
          <VSTButton onClick={onStopRecording} variant="danger" size="small" className="w-full">
            <Stop fontSize="small" className="mr-2" />
            STOP
          </VSTButton>
        )}
        
        <VSTButton 
          onClick={onPlayRecording} 
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
  );
}; 