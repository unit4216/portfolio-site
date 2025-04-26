import bgBg from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-bg.png";
import bgFarTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-far-trees.png";
import bgMidTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-mid-trees.png";
import bgCloseTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-close-trees.png";

export const Background = function () {
  return (
    <>
      <img
        src={bgBg}
        alt="bgwoods"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 0, imageRendering: "pixelated" }}
      />
      <img
        src={bgFarTrees}
        alt="bgFarTrees"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 1, imageRendering: "pixelated" }}
      />
      <img
        src={bgMidTrees}
        alt="bgMidTrees"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 2, imageRendering: "pixelated" }}
      />
      <img
        src={bgCloseTrees}
        alt="bgCloseTrees"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ zIndex: 3, imageRendering: "pixelated" }}
      />
    </>
  );
};
