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
import { ENEMY_COLLISION_WIDTH, EnemyData } from "./Enemy.tsx";

const MOVE_SPEED = 4;
const SPRITE_WIDTH = 240;
const SPRITE_HEIGHT = 160;

const COLLISION_WIDTH = 20;
const ATTACK_COLLISION_PADDING = 60;

export const Player = function ({
  keysPressed,
  enemies,
  setEnemyHurt,
  position,
  setPosition,
}: {
  keysPressed: Record<string, boolean>;
  enemies: Record<string, EnemyData>;
  setEnemyHurt: (hurt: boolean, enemyId: string) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
}) {
  const [facing, setFacing] = useState<"right" | "left">("right");

  const requestRef = useRef<number>(0);

  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const [animationState, setAnimationState] = useState<AnimationState>(
    AnimationState.IDLE,
  );
  // used for cooldown between attacks
  const [isAttacking, setIsAttacking] = useState(false);

  const spriteMap: Record<AnimationState, string> = {
    [AnimationState.ATTACK]: attackKnight,
    [AnimationState.JUMP]: jumpKnight,
    [AnimationState.RUN]: runKnight,
    [AnimationState.IDLE]: idleKnight,
    [AnimationState.HURT]: "",
    [AnimationState.DEAD]: "",
  };

  useEffect(() => {
    const update = () => {
      let newVx = 0;
      if (keysPressed["ArrowLeft"] || keysPressed["a"]) newVx = -MOVE_SPEED;
      if (keysPressed["ArrowRight"] || keysPressed["d"]) newVx = MOVE_SPEED;

      for (const enemyId in enemies) {
        const enemy = enemies[enemyId];
        const playerLeft = position.x - COLLISION_WIDTH / 2;
        const playerRight = position.x + COLLISION_WIDTH / 2;
        const enemyLeft = enemy.position.x - ENEMY_COLLISION_WIDTH / 2;
        const enemyRight = enemy.position.x + ENEMY_COLLISION_WIDTH / 2;

        if (
          (newVx > 0 &&
            playerRight + newVx > enemyLeft &&
            playerLeft < enemyRight) ||
          (newVx < 0 &&
            playerLeft + newVx < enemyRight &&
            playerRight > enemyLeft)
        ) {
          newVx = 0;
        }
      }

      let newVy = velocity.y + GRAVITY;

      let isOnGround = false;

      for (const tile of PLATFORMS) {
        const playerBottom = position.y + SPRITE_HEIGHT / 2;
        const playerLeft = position.x - COLLISION_WIDTH / 2;
        const playerRight = position.x + COLLISION_WIDTH / 2;

        const tileTop = tile.y;
        const tileLeft = tile.x;
        const tileRight = tile.x + 128;

        if (
          playerBottom <= tileTop &&
          playerBottom + velocity.y >= tileTop &&
          playerRight > tileLeft &&
          playerLeft < tileRight
        ) {
          setPosition({ ...position, y: tileTop - SPRITE_HEIGHT / 2 });
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

      const newX = position.x + newVx;
      let newY = position.y + newVy;

      if (newY > FLOOR_Y) {
        newY = FLOOR_Y;
      }

      setPosition({ x: newX, y: newY });

      if (animationState === AnimationState.ATTACK) {
        const attackLeft =
          position.x - (COLLISION_WIDTH + ATTACK_COLLISION_PADDING);
        const attackRight =
          position.x + (COLLISION_WIDTH + ATTACK_COLLISION_PADDING);

        for (const enemyId in enemies) {
          const enemy = enemies[enemyId];
          const enemyLeft = enemy.position.x - ENEMY_COLLISION_WIDTH / 2;
          const enemyRight = enemy.position.x + ENEMY_COLLISION_WIDTH / 2;

          console.log(attackLeft, enemyLeft);
          console.log(attackRight, enemyRight);

          if (
            !isAttacking &&
            attackRight > enemyLeft &&
            attackLeft < enemyRight
          ) {
            setEnemyHurt(true, enemyId);
            setIsAttacking(true);
            break;
          }
        }
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [keysPressed, velocity, position]);

  // attack cooldown
  useEffect(() => {
    if (isAttacking) {
      setTimeout(() => {
        setIsAttacking(false);
      }, 200);
    }
  }, [isAttacking]);

  return (
    <img
      alt={"knight"}
      src={spriteMap[animationState]}
      style={{
        width: `${SPRITE_WIDTH}px`,
        height: `${SPRITE_HEIGHT}px`,
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
