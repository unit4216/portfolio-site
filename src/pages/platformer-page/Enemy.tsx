import skeleton from "../../assets/Skeletons_Free_Pack/gifs/skeleton-idle.gif";
import { useState } from "react";

const MOVE_SPEED = 3;

export const Enemy = function () {
  const [enemyPos, setEnemyPos] = useState({ x: 400, y: 400 });

  return (
    <img
      alt={"worm"}
      src={skeleton}
      style={{
        width: "120px",
        height: "80px",
        position: "absolute",
        left: enemyPos.x,
        top: enemyPos.y,
        imageRendering: "pixelated",
        zIndex: 10,
      }}
    />
  );
};
