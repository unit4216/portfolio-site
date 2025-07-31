import React from "react";
import { DrumPad } from "./DrumPad";
import { SAMPLES } from "../../constants/samplerConstants";

interface DrumPadsGridProps {
  activeKeys: string[];
  onPadClick: (key: string) => void;
}

/**
 * Grid component containing all drum pads
 */
export const DrumPadsGrid = ({ activeKeys, onPadClick }: DrumPadsGridProps) => {
  return (
    <div className="rounded-2xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
         style={{ backgroundColor: "#e0e5ec" }}>
      <h3 className="text-sm mb-6 font-semibold" 
          style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        DRUM PADS
      </h3>
      <div className="grid grid-cols-4 gap-6">
        {SAMPLES.map((sample) => (
          <DrumPad
            key={sample.key}
            sample={sample}
            isActive={activeKeys.includes(sample.key)}
            onClick={() => onPadClick(sample.key)}
          />
        ))}
      </div>
    </div>
  );
}; 