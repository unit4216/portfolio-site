import { motion } from "framer-motion";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { KeyboardArrowDown } from "@mui/icons-material";
import { containerVariants, itemVariants } from "./AnimationVariants";

/**
 * Work experience data
 */
const WORK_EXPERIENCES = [
  { 
    title: "Westland", 
    jobTitle: [
      "Software Development Lead (2024-Present)",
      "Software Developer (2023-2024)", 
      "Junior Software Developer (2022-2023)"
    ],
    description: "Progressive experience from Junior Developer to Lead, leading a team of 2 developers while building internal business applications using React, TypeScript, and Firebase.  Launched three new applications including an AI chatbot and an investment management system, while maintaining two existing core business systems. Cut cloud costs by 50% ($20K/year) and built data pipelines with BigQuery, Cloud Functions, and ETL scripts."
  },
  { 
    title: "Paliza Consulting", 
    jobTitle: [
      "Software Development Consultant"
    ],
    description: "Built and maintained Python ETL tools for parsing and visualizing energy industry data."
  },
  { 
    title: "Synergy", 
    jobTitle: [
      "IT Engineer"
    ],
    description: "Provided on-site IT support and remote monitoring for global clients, managing technical infrastructure and troubleshooting for diverse client environments."
  },
];

/**
 * Resume accordion component displaying work experience
 */
export const ResumeAccordion = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {WORK_EXPERIENCES.map((experience, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ x: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Accordion
            className="!bg-transparent !shadow-none border-b-[1px] border-[#282828] !rounded-none"
            sx={{ "&::before": { display: "none" } }}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowDown className="text-[#282828]" />}
            >
              <div className="text-[30px]">{experience.title}</div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="text-[18px] text-[#666] mb-2" style={{ fontStyle: 'italic', fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif", fontWeight: 100 }}>
                {experience.jobTitle.map((title, index) => (
                  <div key={index} className="mb-1 last:mb-0">{title}</div>
                ))}
              </div>
              <div className="text-[18px] mt-4 leading-relaxed">{experience.description}</div>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </motion.div>
  );
}; 