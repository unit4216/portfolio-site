import { motion } from "framer-motion";
import { TextField } from "@mui/material";
import { containerVariants, itemVariants } from "./AnimationVariants";

interface StyledTextFieldProps {
  rows?: number;
  placeholder: string;
}

/**
 * Styled text field component with hover animations
 */
const StyledTextField = ({ rows = 1, placeholder }: StyledTextFieldProps) => {
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

/**
 * Contact form component with animated fields
 */
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
        <div className="w-1/2">
          <StyledTextField placeholder="First Name" />
        </div>
        <div className="w-1/2">
          <StyledTextField placeholder="Last Name" />
        </div>
      </motion.div>
      <motion.div variants={itemVariants}>
        <StyledTextField placeholder="Email" />
      </motion.div>
      <motion.div variants={itemVariants}>
        <StyledTextField placeholder="Enter message" rows={5} />
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