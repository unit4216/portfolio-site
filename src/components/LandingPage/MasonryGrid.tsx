import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { containerVariants } from "./AnimationVariants";

/**
 * Project data for the masonry grid
 */
const PROJECT_ITEMS = [
  { id: 1, text: "DataChat", height: "h-48", img: '/data-chat-gif.gif', url: '/data-chat' },
  { id: 2, text: "Drum Machine", height: "h-96", img: '/sampler-gif.gif', url: '/sampler' },
  { id: 3, text: "Tiny Survival", height: "h-80", img: '/game-gif.gif', url: 'https://pfpaliza.itch.io/tiny-survival' },
  {
    id: 4,
    text: "Cancer Detection Using Neural Networks",
    height: "h-64",
    img: '/cancer-gif.gif',
    url: "https://github.com/unit4216/cancer-cnn/blob/main/cnn-cancer-detection.ipynb",
  },
];

/**
 * Masonry grid component displaying project cards
 */
export const MasonryGrid = () => {
  return (
    <motion.div 
      className="columns-2 gap-4 p-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {PROJECT_ITEMS.map((item) => (
        <ProjectCard key={item.id} {...item} />
      ))}
    </motion.div>
  );
}; 