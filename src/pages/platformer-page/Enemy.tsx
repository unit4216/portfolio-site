import skeletonIdle from "../../assets/Skeletons_Free_Pack/gifs/skeleton-idle.gif";
import skeletonWalk from "../../assets/Skeletons_Free_Pack/gifs/skeleton-walk.gif";
import skeletonHurt from "../../assets/Skeletons_Free_Pack/gifs/skeleton-hurt.gif";
import skeletonDead from "../../assets/Skeletons_Free_Pack/gifs/skeleton-die.gif";

import { useEffect, useRef, useState } from "react";
import { AnimationState, FLOOR_Y, GRAVITY, PLATFORMS } from "./common.ts";

export const ENEMY_WIDTH = 150;
export const ENEMY_HEIGHT = 100;

export const ENEMY_COLLISION_WIDTH = 30;

export const Enemy = function ({
  position,
  setPosition,
  hurt,
  setHurt,
}: {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  hurt: boolean;
  setHurt: (hurt: boolean) => void;
}) {
  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.IDLE,
  );
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState<"right" | "left">("left");
  const requestRef = useRef<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [destroyed, setDestroyed] = useState<boolean>(false);

  const spriteMap: Record<AnimationState, string> = {
    [AnimationState.RUN]: skeletonWalk,
    [AnimationState.IDLE]: skeletonIdle,
    [AnimationState.ATTACK]: "",
    [AnimationState.JUMP]: "",
    [AnimationState.HURT]: skeletonHurt,
    [AnimationState.DEAD]: skeletonDead,
  };

  useEffect(() => {
    const update = () => {
      const newVx = 0;

      let newVy = velocity.y + GRAVITY;

      for (const tile of PLATFORMS) {
        const playerBottom = position.y + ENEMY_HEIGHT / 2;
        const playerLeft = position.x - ENEMY_WIDTH / 2;
        const playerRight = position.x + ENEMY_WIDTH / 2;

        const tileTop = tile.y;
        const tileLeft = tile.x;
        const tileRight = tile.x + 128;

        if (
          playerBottom <= tileTop &&
          playerBottom + velocity.y >= tileTop &&
          playerRight > tileLeft &&
          playerLeft < tileRight
        ) {
          setPosition({ ...position, y: tileTop - ENEMY_HEIGHT / 2 });
          newVy = 0;
        }
      }

      setVelocity({ x: newVx, y: newVy });

      if (!health) {
        setAnimationState(AnimationState.DEAD);
        setTimeout(() => {
          setDestroyed(true);
        }, 1500);
      } else if (hurt) {
        setAnimationState(AnimationState.HURT);
        setTimeout(() => {
          setAnimationState(AnimationState.IDLE);
          setHurt(false);
        }, 500);
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

      const newX = position.x + newVx;
      let newY = position.y + newVy;

      if (newY > FLOOR_Y) {
        newY = FLOOR_Y;
      }
      setPosition({ x: newX, y: newY });

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [velocity, position, setPosition]);

  useEffect(() => {
    if (hurt) setHealth((prev) => Math.max(prev - 20, 0));
  }, [hurt]);

  if (destroyed) return null;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: position.x - 30,
          top: position.y - 80,
          width: "60px",
          height: "8px",
          backgroundColor: "red",
          zIndex: 11,
          transform: "translateX(-50%)",
        }}
      >
        <div
          style={{
            width: `${health}%`,
            height: "100%",
            backgroundColor: "limegreen",
          }}
        />
      </div>
      <img
        alt={"enemy"}
        src={spriteMap[animationState]}
        style={{
          width: `${ENEMY_WIDTH}px`,
          height: `${ENEMY_HEIGHT}px`,
          position: "absolute",
          left: position.x,
          top: position.y,
          imageRendering: "pixelated",
          transform: `translate(-50%, -50%) scaleX(${facing === "left" ? -1 : 1})`,
          zIndex: 10,
        }}
      />
    </>
  );
};
