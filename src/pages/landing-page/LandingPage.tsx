import React from "react";
import { motion } from "framer-motion";
import { Circle } from "@mui/icons-material";
import "../../App.css";

// Import components
import { Navigation } from "../../components/LandingPage/Navigation";
import { MasonryGrid } from "../../components/LandingPage/MasonryGrid";
import { ResumeAccordion } from "../../components/LandingPage/ResumeAccordion";
import { ContactSection } from "../../components/LandingPage/ContactSection";
import { fadeInUp, slideInLeft, slideInRight, containerVariants, itemVariants } from "../../components/LandingPage/AnimationVariants";

/**
 * Custom horizontal rule component with animation
 */
const CustomHR = () => {
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

/**
 * Skills section component
 */
const SkillsSection = () => {
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

/**
 * Footer component with social links
 */
const Footer = () => {
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

/**
 * Hero section component with animated text
 */
const HeroSection = () => {
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

/**
 * About section component
 */
const AboutSection = () => {
  return (
    <section className="scroll-mt-16" id="about">
      <motion.div 
        className="text-[45px] mt-44"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        About Me
      </motion.div>
      <CustomHR />
      <div className="mt-24" />
      <div className="flex flex-row">
        <motion.div 
          className="w-1/2 text-[30px]"
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          I'm a full-stack software developer with five years of experience
          designing solutions for problems.
          
          <motion.div
            className="mt-8"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/latex-resume.pdf';
                link.download = 'Pablo_Paliza_Carre_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-[#282828] hover:bg-[#282828] hover:text-white transition-all duration-300 text-[16px] font-medium cursor-pointer"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="w-1/2"
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ResumeAccordion />
        </motion.div>
      </div>
      <SkillsSection />
    </section>
  );
};

/**
 * Main landing page component
 */
export const LandingPage = () => {
  const sections = ["projects", "about", "contact"];

  /**
   * Scroll to a specific section on the page
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]"
      style={{ fontFamily: "Neue Haas Grotesk" }}
    >
      <Navigation sections={sections} onSectionClick={scrollToSection} />
      
      <HeroSection />
      
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
      
      <AboutSection />
      
      <section className="scroll-mt-16" id="contact">
        <motion.div 
          className="text-[45px] mt-44"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Contact
        </motion.div>
        <CustomHR />
        <div className="mt-24" />
        <ContactSection />
      </section>
      
      <Footer />
    </div>
  );
};
