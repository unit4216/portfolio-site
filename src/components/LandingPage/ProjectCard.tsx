import { motion } from "framer-motion";
import { OpenInNew } from "@mui/icons-material";
import { itemVariants } from "./AnimationVariants";

interface ProjectCardProps {
  id: number;
  text: string;
  height: string;
  img: string;
  url: string;
}

/**
 * Individual project card component for the masonry grid
 */
export const ProjectCard = ({ text, height, img, url }: ProjectCardProps) => {
  return (
    <motion.a 
      href={url} 
      target={url?.startsWith('/') ? undefined : "_blank"}
      className="block mb-4"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <motion.div
        className={`relative group break-inside-avoid rounded-lg overflow-hidden shadow-md border-none ${height}`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-cover z-0 group-hover:brightness-50 transition-brightness duration-300"
          style={{
            backgroundImage: img ? `url(${img})` : undefined,
            backgroundPosition: img ? 'top center' : 'center',
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         text-[#F5F5F5] text-center px-4 py-2 rounded text-2xl flex flex-row items-center gap-x-2"
          >
            {text} <OpenInNew fontSize={"small"} />
          </motion.div>
        </div>
      </motion.div>
    </motion.a>
  );
}; 