import React from "react";
import { motion } from "framer-motion";
import { CustomHR } from "./CustomHR";
import { MasonryGrid } from "./MasonryGrid";
import { fadeInUp } from "./AnimationVariants";

/**
 * Projects section component
 */
export const ProjectsSection = () => {
  return (
    <section className="scroll-mt-16" id="projects">
      <motion.div 
        className="text-[45px] mt-44"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Projects
      </motion.div>
      <CustomHR />
      <div className="mt-10">
        <MasonryGrid />
      </div>
    </section>
  );
}; 