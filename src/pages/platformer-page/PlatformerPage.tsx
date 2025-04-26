import { useEffect, useState } from "react";
import skeleton from "../../assets/Skeletons_Free_Pack/gifs/skeleton-idle.gif";
import { Player } from "./Player.tsx";
import { Background } from "./Background.tsx";
import { PLATFORMS } from "./common.ts";

export const PlatformerPage = () => {
  const [enemyPos, setEnemyPos] = useState({ x: 400, y: 400 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      <Background />

      {PLATFORMS.map((tile, index) => (
        <img
          key={index}
          src={tile.src}
          alt={tile.type}
          className="absolute"
          style={{
            left: tile.x,
            top: tile.y,
            width: "128px",
            height: "24px",
            imageRendering: "pixelated",
            zIndex: 10,
          }}
        />
      ))}

      <Player keysPressed={keysPressed} />
      <img
        alt={"worm"}
        src={skeleton}
        style={{
          width: "240px",
          height: "160px",
          position: "absolute",
          left: enemyPos.x,
          top: enemyPos.y,
          imageRendering: "pixelated",
          filter: "saturate(2) contrast(5)",
          zIndex: 10,
        }}
      />
    </div>
  );
};
