import bgBg from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-bg.png";
import bgFarTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-far-trees.png";
import bgMidTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-mid-trees.png";
import bgCloseTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-close-trees.png";
export const Background = function ({ scrollX }: { scrollX: number }) {
  return (
    <>
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgBg})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.2}px`,
          backgroundSize: "cover",
          zIndex: 0,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgFarTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.4}px`,
          backgroundSize: "cover",
          zIndex: 1,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgMidTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.6}px`,
          backgroundSize: "cover",
          zIndex: 2,
          imageRendering: "pixelated",
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgCloseTrees})`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: `${-scrollX * 0.8}px`,
          backgroundSize: "cover",
          zIndex: 3,
          imageRendering: "pixelated",
        }}
      />
    </>
  );
};
