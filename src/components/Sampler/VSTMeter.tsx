
interface VSTMeterProps {
  value: number;
  label: string;
}

/**
 * VST-style meter component for displaying audio levels
 */
export const VSTMeter = ({ value, label }: VSTMeterProps) => {
  const height = 80;
  const segments = 20;
  const segmentHeight = height / segments;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs mb-1 font-medium" 
           style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {label}
      </div>
      <div className="relative w-4 h-20 rounded-lg shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
           style={{ backgroundColor: "#e0e5ec" }}>
        {Array.from({ length: segments }, (_, i) => {
          const segmentValue = (i + 1) / segments;
          const isActive = value >= segmentValue;
          const isPeak = i === segments - 1 && value >= 0.95;
          
          return (
            <div
              key={i}
              className="w-full border-b border-gray-300"
              style={{ 
                height: segmentHeight,
                backgroundColor: isPeak ? "#2d3748" : 
                isActive ? "#a0aec0" : "#e0e5ec"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}; 