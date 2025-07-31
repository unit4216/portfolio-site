import React from "react";
import { motion } from "framer-motion";

/**
 * Hero section component with animated text
 */
export const HeroSection = () => {
  return (
    <section className="h-screen">
      <motion.div 
        className="text-[200px] w-1/3"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        pablo
      </motion.div>
      <motion.div 
        className="text-[200px] w-2/3 text-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
      >
        paliza
      </motion.div>
      <motion.div 
        className="text-[200px] w-full flex flex-row justify-between items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      >
        <motion.div className="text-[25px]" transition={{ duration: 0.2 }}>
          * full stack software engineer
        </motion.div>
        <motion.div transition={{ duration: 0.2 }}>
          carre*
        </motion.div>
      </motion.div>
    </section>
  );
}; 