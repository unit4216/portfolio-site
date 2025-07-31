import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavigationProps {
  sections: string[];
  onSectionClick: (sectionId: string) => void;
}

/**
 * Navigation header component with scroll-based styling
 */
export const Navigation = ({ sections, onSectionClick }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className={`fixed z-50 top-0 left-0 w-full bg-[#F5F5F5] px-40 py-4 transition-shadow duration-300 ${
        isScrolled ? 'shadow-sm' : 'shadow-none'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex flex-row justify-end gap-x-10 text-[25px]">
        {sections.map((section) => (
          <motion.button 
            key={section}
            className="cursor-pointer"
            onClick={() => onSectionClick(section)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ 
              y: -3, 
              scale: 1.05,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {section}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}; 