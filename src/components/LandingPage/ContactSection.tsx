import { useState } from "react";
import { motion } from "framer-motion";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckIcon from "@mui/icons-material/Check";

/**
 * Contact section component with profile image and contact information
 */
export const ContactSection = () => {
  const email = "pf.paliza@gmail.com";
  const linkedin = "https://www.linkedin.com/in/pablo-paliza-carre-029676134/";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Animation variants for staggered entrance
  const fadeSlide = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex flex-row items-stretch gap-12 mx-auto w-full mb-32">
      {/* Left Text */}
      <motion.div
        className="w-1/2 flex text-[30px]"
        variants={fadeSlide}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0}
      >
        If you're interested in hiring me, please reach out.
      </motion.div>
      
      {/* Contact Card */}
      <div className="w-1/2 flex items-center">
        <div className="flex items-center gap-8 w-1/2">
          {/* Profile Image */}
          <motion.img
            src="./linked-pic-pxl-20.png"
            alt="Profile"
            className="h-32 w-32 object-cover rounded-xl shadow-lg"
            style={{ imageRendering: "pixelated" }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            variants={fadeSlide}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
          />

          {/* Contact Info */}
          <div className="flex flex-col gap-2 flex-1">
            {/* Email */}
            <motion.div
              variants={fadeSlide}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={2}
            >
              <div className="flex items-center gap-2 text-lg text-gray-800">
                <span>{email}</span>
                <button
                  onClick={handleCopy}
                  className="hover:text-blue-400 transition"
                  title="Copy email"
                >
                  {copied ? (
                    <CheckIcon fontSize="small" className="text-black" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </button>
              </div>
              {/* Animated HR */}
              <motion.hr
                className="border-t border-gray-300 my-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>

            {/* LinkedIn */}
            <motion.div
              variants={fadeSlide}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={3}
            >
              <motion.a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-lg text-gray-800 font-semibold hover:text-blue-400 transition relative"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <span className="relative" style={{ display: "inline-block" }}>
                  LinkedIn
                  <motion.span
                    className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-400 origin-left scale-x-0"
                    variants={{
                      rest: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </span>
                <OpenInNewIcon fontSize="small" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}; 