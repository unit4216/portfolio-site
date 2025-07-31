import { motion } from "framer-motion";
import { CustomHR } from "./CustomHR";
import { SkillsSection } from "./SkillsSection";
import { ResumeAccordion } from "./ResumeAccordion";
import { fadeInUp, slideInLeft, slideInRight, itemVariants } from "./AnimationVariants";

/**
 * About section component
 */
export const AboutSection = () => {
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