import React from "react";
import { motion } from "framer-motion";
import { CustomHR } from "./CustomHR";
import { ContactSection } from "./ContactSection";
import { fadeInUp } from "./AnimationVariants";

/**
 * Contact section wrapper component
 */
export const ContactSectionWrapper = () => {
  return (
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
  );
}; 