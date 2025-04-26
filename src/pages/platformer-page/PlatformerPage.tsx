import { useEffect, useState } from "react";
import { Player } from "./Player.tsx";
import { Background } from "./Background.tsx";
import { PLATFORMS } from "./common.ts";
import { Enemy } from "./Enemy.tsx";

export const PlatformerPage = () => {
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [enemyPosition, setEnemyPosition] = useState({ x: 400, y: 400 });

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

      <Player keysPressed={keysPressed} enemyPosition={enemyPosition} />
      <Enemy
        position={enemyPosition}
        setPosition={(pos) => setEnemyPosition(pos)}
      />
    </div>
  );
};
