import React from "react";

interface EffectsPanelProps {
  reverbMix: number;
  onReverbMixChange: (mix: number) => void;
  dryGain: GainNode | null;
  wetGain: GainNode | null;
}

/**
 * Effects panel component with reverb controls
 */
export const EffectsPanel = ({ reverbMix, onReverbMixChange, dryGain, wetGain }: EffectsPanelProps) => {
  const handleReverbMixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mix = parseFloat(e.target.value);
    onReverbMixChange(mix);

    if (dryGain && wetGain) {
      dryGain.gain.value = 1 - mix;
      wetGain.gain.value = mix;
    }
  };

  return (
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
          onChange={handleReverbMixChange}
          className="w-full h-3 rounded-xl appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #a0aec0 0%, #a0aec0 ${reverbMix * 100}%, #e0e5ec ${reverbMix * 100}%, #e0e5ec 100%)`,
            boxShadow: 'inset 2px 2px 5px rgba(163,177,198,0.6), inset -2px -2px 5px rgba(255,255,255,0.8)'
          }}
        />
      </div>
    </div>
  );
}; 