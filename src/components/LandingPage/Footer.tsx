import React from "react";
import { motion } from "framer-motion";
import { CustomHR } from "./CustomHR";

/**
 * Footer component with social links
 */
export const Footer = () => {
  return (
    <>
      <CustomHR />
      <div className="mt-10" />
      <motion.div 
        className="flex flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-[#6B7280] text-[14px]">
          &copy; 2025 Pablo Paliza. All rights reserved.
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <motion.a
            href="https://www.linkedin.com/in/pablo-paliza-carre-029676134/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/linkedin-icon.png" className="h-6" alt="LinkedIn" />
          </motion.a>
          <motion.a
            href="https://www.github.com/unit4216"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/github-icon.png" className="h-6" alt="GitHub" />
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}; 