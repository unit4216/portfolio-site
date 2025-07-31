/**
 * Constants for the sampler application
 */

// Sample file paths
export const SAMPLE_PATHS = {
  cowbell: "/808-samples/Roland TR-808/CB/CB.WAV",
  bass: "/808-samples/Roland TR-808/BD/BD0000.WAV",
  snare: "/808-samples/Roland TR-808/SD/SD0010.WAV",
  closedHat: "/808-samples/Roland TR-808/CH/CH.WAV",
  hiTom: "/808-samples/Roland TR-808/HT/HT00.WAV",
  cymbal: "/808-samples/Roland TR-808/CY/CY0000.WAV",
  clap: "/808-samples/Roland TR-808/CP/CP.WAV",
  openHat: "/808-samples/Roland TR-808/OH/OH00.WAV",
  metronomeClick: "/808-samples/Roland TR-808/RS/RS.WAV"
};

/**
 * Sample configuration with key mappings and display names
 */
export const SAMPLES = [
  { src: SAMPLE_PATHS.cowbell, key: "q", name: "Cowbell" },
  { src: SAMPLE_PATHS.bass, key: "w", name: "Bass" },
  { src: SAMPLE_PATHS.snare, key: "e", name: "Snare" },
  { src: SAMPLE_PATHS.closedHat, key: "r", name: "Closed Hat" },
  { src: SAMPLE_PATHS.hiTom, key: "a", name: "Hi Tom" },
  { src: SAMPLE_PATHS.cymbal, key: "s", name: "Cymbal" },
  { src: SAMPLE_PATHS.clap, key: "d", name: "Clap" },
  { src: SAMPLE_PATHS.openHat, key: "f", name: "Open Hat" },
]; 