import React from "react";
import "../../App.css";
import { Circle, KeyboardArrowDown, OpenInNew } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { TextField } from "@mui/material";
import { motion } from "framer-motion";

// Animation variants for staggered entrance animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export function MasonryGrid() {
  const items = [
    { id: 1, text: "project1", height: "h-48", img: null },
    { id: 2, text: "project2", height: "h-96", img: null },
    { id: 3, text: "project3", height: "h-80", img: null },
    {
      id: 4,
      text: "Cancer Detection Using Neural Networks",
      height: "h-64",
      img: "./src/assets/cancer-pixel.png",
      url: "https://github.com/unit4216/cancer-cnn/blob/main/cnn-cancer-detection.ipynb",
    },
  ];

  return (
    <motion.div 
      className="columns-2 gap-4 p-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {items.map((item, index) => (
        <motion.a 
          href={item.url} 
          target="_blank" 
          className="block mb-4"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <motion.div
            className={`relative group break-inside-avoid rounded-lg overflow-hidden shadow-md border-none ${item.height}`}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center z-0 group-hover:brightness-50 transition-brightness duration-300"
              style={{
                backgroundImage: item.img ? `url(${item.img})` : undefined,
              }}
            />
            <div className="relative z-10 flex flex-col justify-center items-center h-full">
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                 text-[#F5F5F5] text-center  px-4 py-2 rounded text-2xl flex flex-row items-center gap-x-2"
              >
                {item.text} <OpenInNew fontSize={"small"} />
              </motion.div>
            </div>
          </motion.div>
        </motion.a>
      ))}
    </motion.div>
  );
}

const ResumeAccordion = () => {
  const EXPERIENCES = [
    { title: "Westland", description: "Worked at Westland." },
    { title: "Paliza Consulting", description: "Worked at Paliza Consulting." },
    { title: "Synergy", description: "Worked at Synergy IT." },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {EXPERIENCES.map((experience, index) => (
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
              <div className="text-[20px]">{experience.description}</div>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </motion.div>
  );
};

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

const StyledTextField = ({
  rows = 1,
  placeholder,
}: {
  rows?: number;
  placeholder: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <TextField
        rows={rows}
        multiline
        fullWidth
        placeholder={placeholder}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#282828",
            },
            "&:hover fieldset": {
              borderColor: "#282828",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#282828",
            },
          },
        }}
      />
    </motion.div>
  );
};

export const ContactForm = () => {
  return (
    <motion.div 
      className="flex flex-col gap-y-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className="flex flex-row gap-x-4" variants={itemVariants}>
        <StyledTextField placeholder={"First Name"} />
        <StyledTextField placeholder={"Last Name"} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StyledTextField placeholder={"Email"} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StyledTextField placeholder={"Enter message"} rows={5} />
      </motion.div>
      <motion.button 
        className="rounded-none border-[2px] border-[#282828] w-22 h-9"
        variants={itemVariants}
        whileHover={{ 
          scale: 1.05,
          backgroundColor: "#282828",
          color: "#F5F5F5"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Send
      </motion.button>
    </motion.div>
  );
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    console.log("test");
  }
};

export const LandingPage = () => {
  const sections = ["Work", "About", "Contact"];

  const SKILLS = ["TypeScript", "React", "Tailwind", "Google Cloud"];

  return (
    <div
      className="text-[#282828] px-40 py-4 w-[100vw] bg-[#F5F5F5]"
      style={{ fontFamily: "Neue Haas Grotesk" }}
    >
      <motion.div 
        className="fixed z-50 top-0 left-0 w-full bg-[#F5F5F5] px-40 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-row justify-end gap-x-10 text-[25px]">
          {sections.map((section, index) => {
            return (
              <motion.button 
                key={section}
                onClick={() => scrollTo(section)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {section}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
      
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
          <motion.div 
            className="text-[25px]"
            transition={{ duration: 0.2 }}
          >
            *Full stack software engineer
          </motion.div>

          <motion.div
            transition={{ duration: 0.2 }}
          >
            carre*
          </motion.div>
        </motion.div>
      </section>
      
      <section className=" scroll-mt-16" id={"Work"}>
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
      
      <section className="scroll-mt-16" id={"About"}>
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
      </section>
      
      <section className="scroll-mt-16" id={"Contact"}>
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
        <div className="flex flex-row mb-32">
          <motion.div 
            className="w-1/2 text-[30px]"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            If you're interested in hiring me, please reach out.
          </motion.div>
          <motion.div 
            className="w-1/2"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
      
      <CustomHR />
      <div className="mt-10" />
      <motion.div 
        className="flex flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={"text-[#6B7280] text-[14px]"}>
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
            <img src={"./src/assets/linkedin-icon.png"} className="h-6" />
          </motion.a>
          <motion.a
            href="https://www.github.com/unit4216"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <img src={"./src/assets/github-icon.png"} className="h-6" />
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};
