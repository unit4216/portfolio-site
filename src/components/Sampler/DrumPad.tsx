import React from "react";
import { motion } from "framer-motion";

interface DrumPadProps {
  sample: {
    key: string;
    name: string;
  };
  isActive: boolean;
  onClick: () => void;
}

/**
 * Individual drum pad component
 */
export const DrumPad = ({ sample, isActive, onClick }: DrumPadProps) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.button
        className="w-full h-28 rounded-2xl relative overflow-hidden shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]"
        style={{ backgroundColor: "#e0e5ec" }}
        onClick={onClick}
        animate={{
          scale: isActive ? 1.05 : 1,
          boxShadow: isActive 
            ? 'inset 2px 2px 5px rgba(163,177,198,0.6), inset -2px -2px 5px rgba(255,255,255,0.8)'
            : '2px 2px 5px rgba(163,177,198,0.6), -2px -2px 5px rgba(255,255,255,0.8)'
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        {/* Pad Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs font-medium" 
               style={{ color: "#4a5568", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {sample.name}
          </div>
          <div className="text-lg font-bold" 
               style={{ color: "#2d3748", fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
            {sample.key.toUpperCase()}
          </div>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: "#2d3748" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.button>
    </motion.div>
  );
}; 