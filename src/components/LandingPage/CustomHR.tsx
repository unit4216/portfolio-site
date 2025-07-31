import { motion } from "framer-motion";

/**
 * Custom horizontal rule component with animation
 */
export const CustomHR = () => {
  return (
    <motion.hr 
      className="border-t-[1px] text-[#282828] border-[#282828]"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    />
  );
}; 