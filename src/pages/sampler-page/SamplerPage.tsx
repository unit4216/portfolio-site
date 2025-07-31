import { SamplerHeader } from "../../components/Sampler/SamplerHeader";
import { ControlsPanel } from "../../components/Sampler/ControlsPanel";
import { MainPanel } from "../../components/Sampler/MainPanel";
import { useSamplerAudio } from "../../hooks/useSamplerAudio";

/**
 * Main sampler page component for the drum machine interface
 */
export const SamplerPage = () => {
  const {
    // State
    activeKeys,
    audioContext,
    reverbMix,
    isRecording,
    recordedEvents,
    currentPlayingBuffer,
    isSoundPlaying,
    currentPlaybackTime,
    dryGain,
    wetGain,
    
    // Actions
    playSample,
    startRecording,
    stopRecording,
    playRecording,
    updateReverbMix,
  } = useSamplerAudio();

  return (
    <div className="min-h-screen text-gray-800 p-8 w-screen"
         style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: "#e0e5ec" }}>
      
      {/* Neumorphic Header */}
      <div className="max-w-6xl mx-auto">
        <SamplerHeader isSoundPlaying={isSoundPlaying} />

        {/* Main Neumorphic Interface */}
        <div className="rounded-3xl p-8 shadow-[inset_2px_2px_5px_rgba(163,177,198,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" 
             style={{ backgroundColor: "#e0e5ec" }}>
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Panel - Controls */}
            <ControlsPanel
              audioContext={audioContext}
              reverbMix={reverbMix}
              onReverbMixChange={updateReverbMix}
              dryGain={dryGain}
              wetGain={wetGain}
              isRecording={isRecording}
              recordedEvents={recordedEvents}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlayRecording={playRecording}
            />

            {/* Center Panel - Waveform and Pads */}
            <MainPanel
              currentPlayingBuffer={currentPlayingBuffer}
              isSoundPlaying={isSoundPlaying}
              currentPlaybackTime={currentPlaybackTime}
              activeKeys={activeKeys}
              onPadClick={playSample}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
