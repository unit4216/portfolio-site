import { useEffect, useRef, useState } from "react";
import bgBg from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-bg.png";
import bgCloseTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-close-trees.png";
import bgFarTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-far-trees.png";
import bgMidTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-mid-trees.png";
import ground from "../../assets/DarkForest1.2/ground_tile.png";
import skeleton from "../../assets/Skeletons_Free_Pack/gifs/skeleton-idle.gif";
import { AnimationState, Player } from "./Player.tsx";

const level = [
  { type: "ground", x: 0, y: 600, src: ground },
  { type: "ground", x: 100, y: 600, src: ground },
  { type: "ground", x: 200, y: 600, src: ground },
  { type: "ground", x: 300, y: 600, src: ground },
  { type: "ground", x: 400, y: 600, src: ground },
  { type: "ground", x: 500, y: 600, src: ground },
  { type: "ground", x: 600, y: 600, src: ground },
  { type: "ground", x: 700, y: 600, src: ground },
  { type: "ground", x: 800, y: 600, src: ground },
  { type: "ground", x: 900, y: 600, src: ground },
  { type: "ground", x: 1000, y: 500, src: ground },
  { type: "ground", x: 1100, y: 500, src: ground },
  { type: "ground", x: 1200, y: 500, src: ground },
  { type: "ground", x: 1300, y: 500, src: ground },
];

export const PlatformerPage = () => {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [enemyPos, setEnemyPos] = useState({ x: 400, y: 400 });

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.IDLE,
  );
  const [facing, setFacing] = useState<"right" | "left">("right");

  const requestRef = useRef<number>(0);

  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const MOVE_SPEED = 5;
  const FLOOR_Y = 600;

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

  useEffect(() => {
    const update = () => {
      let newVx = 0;
      if (keysPressed["ArrowLeft"] || keysPressed["a"]) newVx = -MOVE_SPEED;
      if (keysPressed["ArrowRight"] || keysPressed["d"]) newVx = MOVE_SPEED;

      let newVy = velocity.y + GRAVITY;

      let isOnGround = false;

      for (const tile of level) {
        const playerBottom = position.y + 80;
        const playerLeft = position.x - 120 / 2;
        const playerRight = position.x + 120 / 2;

        const tileTop = tile.y;
        const tileLeft = tile.x;
        const tileRight = tile.x + 128;

        if (
          playerBottom <= tileTop &&
          playerBottom + velocity.y >= tileTop &&
          playerRight > tileLeft &&
          playerLeft < tileRight
        ) {
          setPosition((p) => ({ ...p, y: tileTop - 80 }));
          newVy = 0;
          isOnGround = true;
        }
      }

      if (
        (keysPressed["ArrowUp"] || keysPressed["w"] || keysPressed[" "]) &&
        isOnGround
      ) {
        newVy = JUMP_FORCE;
      }

      setVelocity({ x: newVx, y: newVy });

      if (keysPressed["e"]) {
        setAnimationState(AnimationState.ATTACK);
      } else if (newVy < 0 || newVy > 5) {
        setAnimationState(AnimationState.JUMP);
      } else if (newVx !== 0) {
        setAnimationState(AnimationState.RUN);
      } else {
        setAnimationState(AnimationState.IDLE);
      }

      if (newVx > 0) {
        setFacing("right");
      } else if (newVx < 0) {
        setFacing("left");
      }

      setPosition((p) => {
        const newX = p.x + newVx;
        let newY = p.y + newVy;

        if (newY > FLOOR_Y) {
          newY = FLOOR_Y;
        }

        return { x: newX, y: newY };
      });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [keysPressed, velocity, position, JUMP_FORCE]);

  return (
    <div className="relative w-screen h-screen bg-sky-300 overflow-hidden">
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

      {level.map((tile, index) => (
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
        position={position}
        facing={facing}
        animationState={animationState}
      />
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
          transform: `translate(-50%, -50%) scaleX(${facing === "left" ? -1 : 1})`,
          filter: "saturate(2) contrast(5)",
          zIndex: 10,
        }}
      />
    </div>
  );
};
