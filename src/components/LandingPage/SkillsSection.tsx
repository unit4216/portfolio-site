import React from "react";
import { motion } from "framer-motion";
import { Circle } from "@mui/icons-material";
import { containerVariants, itemVariants } from "./AnimationVariants";

/**
 * Skills section component
 */
export const SkillsSection = () => {
  const SKILLS = ["TypeScript", "React", "Tailwind", "Google Cloud"];
  
  return (
    <motion.div 
      className="flex flex-row mt-44 justify-center gap-x-4 items-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {SKILLS.map((skill, index) => (
        <React.Fragment key={skill}>
          <motion.div
            className="text-[24px]"
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {skill}
          </motion.div>
          {index < SKILLS.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            >
              <Circle className="text-[#282828]" sx={{ fontSize: "6px" }} />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}; 