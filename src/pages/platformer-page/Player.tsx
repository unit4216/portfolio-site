import attackKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Attack.gif";
import jumpKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Jump.gif";
import runKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Run.gif";
import idleKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Idle.gif";
import { useEffect, useRef, useState } from "react";
import {
  AnimationState,
  FLOOR_Y,
  GRAVITY,
  JUMP_FORCE,
  PLATFORMS,
} from "./common.ts";

const MOVE_SPEED = 4;

export const Player = function ({
  keysPressed,
}: {
  keysPressed: Record<string, boolean>;
}) {
  const [facing, setFacing] = useState<"right" | "left">("right");

  const requestRef = useRef<number>(0);

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.IDLE,
  );
  const [position, setPosition] = useState({ x: 100, y: 300 });

  const spriteMap: Record<AnimationState, string> = {
    [AnimationState.ATTACK]: attackKnight,
    [AnimationState.JUMP]: jumpKnight,
    [AnimationState.RUN]: runKnight,
    [AnimationState.IDLE]: idleKnight,
  };

  useEffect(() => {
    const update = () => {
      let newVx = 0;
      if (keysPressed["ArrowLeft"] || keysPressed["a"]) newVx = -MOVE_SPEED;
      if (keysPressed["ArrowRight"] || keysPressed["d"]) newVx = MOVE_SPEED;

      let newVy = velocity.y + GRAVITY;

      let isOnGround = false;

      for (const tile of PLATFORMS) {
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
    <img
      alt={"knight"}
      src={spriteMap[animationState]}
      style={{
        width: "240px",
        height: "160px",
        position: "absolute",
        left: position.x,
        top: position.y,
        imageRendering: "pixelated",
        transform: `translate(-50%, -50%) scaleX(${facing === "left" ? -1 : 1})`,
        filter: "saturate(2) contrast(5)",
        zIndex: 10,
      }}
    />
  );
};
