import bgBg from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-bg.png";
import bgFarTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-far-trees.png";
import bgMidTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-mid-trees.png";
import bgCloseTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-close-trees.png";
import { LEVEL_WIDTH } from "./PlatformerPage.tsx";
export const Background = function ({ scrollX }: { scrollX: number }) {
  return (
    <>
      <div
        className="absolute top-0 left-0 h-screen"
        style={{
          width: LEVEL_WIDTH,
          backgroundImage: `url(${bgBg})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.02}px`,
          backgroundSize: "auto 100%",
          zIndex: 0,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-[200vw] h-full"
        style={{
          width: LEVEL_WIDTH,
          backgroundImage: `url(${bgFarTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.01}px`,
          backgroundSize: "auto 100%",
          zIndex: 1,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-[200vw] h-full"
        style={{
          width: LEVEL_WIDTH,
          backgroundImage: `url(${bgMidTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.1}px`,
          backgroundSize: "auto 100%",
          zIndex: 2,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-[200vw] h-full"
        style={{
          width: LEVEL_WIDTH,
          backgroundImage: `url(${bgCloseTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.2}px`,
          backgroundSize: "auto 100%",
          zIndex: 3,
          imageRendering: "pixelated",
        }}
      />
    </>
  );
};
