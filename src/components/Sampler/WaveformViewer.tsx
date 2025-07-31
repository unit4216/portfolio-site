import { useEffect, useRef } from "react";

/**
 * Waveform viewer component for displaying audio waveforms
 */
interface WaveformViewerProps {
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export const WaveformViewer = ({ 
  audioBuffer, 
  isPlaying, 
  currentTime, 
  duration 
}: WaveformViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale the context to match the device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Set canvas display size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Get audio data
    const channelData = audioBuffer.getChannelData(0);
    const samples = channelData.length;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Draw background
    ctx.fillStyle = '#e0e5ec'; // Neumorphic background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw subtle grid
    ctx.strokeStyle = 'rgba(160, 174, 192, 0.2)'; // Modern gray with opacity
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i < canvasWidth; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < canvasHeight; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }

    // Draw waveform
    const step = Math.ceil(samples / canvasWidth);
    const amp = (canvasHeight / 2) * 0.9; // Slightly smaller amplitude for aesthetics
    
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    
    // Draw the waveform
    for (let i = 0; i < canvasWidth; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      // Create gradient for waveform using modern colors
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, 'rgba(45, 55, 72, 0.8)'); // Dark gray with opacity
      gradient.addColorStop(1, 'rgba(74, 85, 104, 0.6)'); // Medium gray with opacity
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      
      const x = i;
      const y = (1 + min) * amp;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    // Complete the waveform path
    ctx.stroke();

    // Draw playhead if playing
    if (isPlaying && duration > 0) {
      const playheadX = (currentTime / duration) * canvasWidth;
      
      // Draw playhead line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(45, 55, 72, 0.8)'; // Dark gray with opacity
      ctx.lineWidth = 2;
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();
      
      // Draw playhead glow
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(45, 55, 72, 0.2)';
      ctx.lineWidth = 6;
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();
    }
  }, [audioBuffer, isPlaying, currentTime, duration]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" 
            style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          WAVEFORM
        </h3>
        {isPlaying && (
          <div className="text-xs font-medium" 
               style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {Math.floor(currentTime * 1000)}ms / {Math.floor(duration * 1000)}ms
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded-xl shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
        style={{ backgroundColor: "#e0e5ec" }}
      />
    </div>
  );
}; 