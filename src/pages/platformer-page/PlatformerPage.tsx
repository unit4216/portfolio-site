import { useEffect, useState } from "react";
import { Player } from "./Player.tsx";
import { Background } from "./Background.tsx";
import { PLATFORMS } from "./common.ts";
import { Enemy, EnemyData } from "./Enemy.tsx";
import { v4 as uuid } from "uuid";

export const LEVEL_WIDTH = "5000px";

export const PlatformerPage = () => {
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [enemies, setEnemies] = useState<Record<string, EnemyData>>({
    [uuid()]: { position: { x: 400, y: 400 }, hurt: false, destroyed: false },
  });
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 300 });

  const allDestroyed = Object.entries(enemies).every(
    ([_, data]) => data.destroyed,
  );

  // spawn new enemy when old enemy destroyed
  useEffect(() => {
    if (allDestroyed) {
      const enemiesRef = {
        ...enemies,
        [uuid()]: {
          position: { x: 600, y: 400 },
          hurt: false,
          destroyed: false,
        },
      };

      setTimeout(() => setEnemies(enemiesRef), 1000);
    }
  }, [allDestroyed]);

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

  const setEnemyPosition = (enemyId: string, pos: { x: number; y: number }) => {
    setEnemies((prev) => ({
      ...prev,
      [enemyId]: { ...prev[enemyId], position: pos },
    }));
  };

  const setEnemyHurt = (enemyId: string, hurt: boolean) => {
    setEnemies((prev) => ({
      ...prev,
      [enemyId]: { ...prev[enemyId], hurt },
    }));
  };

  const setEnemyDestroyed = (enemyId: string, destroyed: boolean) => {
    setEnemies((prev) => ({
      ...prev,
      [enemyId]: { ...prev[enemyId], destroyed },
    }));
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div
        className="absolute top-0 left-0 h-screen"
        style={{
          width: LEVEL_WIDTH,
          transform: `translateX(${-Math.max(0, playerPosition.x - window.innerWidth / 2)}px)`,
          transition: "transform 0.02s linear",
        }}
      >
        <Background scrollX={playerPosition.x} />
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
        <Player
          keysPressed={keysPressed}
          enemies={enemies}
          position={playerPosition}
          setPosition={(position) => setPlayerPosition(position)}
          setEnemyHurt={(hurt: boolean, enemyId: string) => {
            setEnemies((prev) => ({
              ...prev,
              [enemyId]: { ...prev[enemyId], hurt },
            }));
          }}
        />
        {Object.entries(enemies).map(([enemyId, enemy]) => {
          return (
            <Enemy
              key={enemyId}
              position={enemy.position}
              setPosition={(pos) => setEnemyPosition(enemyId, pos)}
              hurt={enemy.hurt}
              setHurt={(hurt) => setEnemyHurt(enemyId, hurt)}
              setDestroyed={(destroyed: boolean) =>
                setEnemyDestroyed(enemyId, destroyed)
              }
              destroyed={enemy.destroyed}
            />
          );
        })}
      </div>
    </div>
  );
};
