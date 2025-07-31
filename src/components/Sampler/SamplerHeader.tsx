import React from "react";
import { PlayCircle } from "@mui/icons-material";
import { VSTMeter } from "./VSTMeter";

interface SamplerHeaderProps {
  isSoundPlaying: boolean;
}

/**
 * Header component for the sampler interface
 */
export const SamplerHeader = ({ isSoundPlaying }: SamplerHeaderProps) => {
  return (
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
  );
}; 