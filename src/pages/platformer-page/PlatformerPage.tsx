import { useEffect, useRef, useState } from "react";
import idleKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Idle.gif";
import attackKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Attack.gif";
import runKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Run.gif";
import jumpKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Jump.gif";
import bgBg from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-bg.png";
import bgCloseTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-close-trees.png";
import bgFarTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-far-trees.png";
import bgMidTrees from "../../assets/parallax_demon_woods_pack/layers/parallax-demon-woods-mid-trees.png";

export const PlatformerPage = () => {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [animationState, setAnimationState] = useState<
    "idle" | "run" | "attack" | "jump"
  >("idle");
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
      setVelocity((v) => {
        let newVx = 0;
        if (keysPressed["ArrowLeft"] || keysPressed["a"]) newVx = -MOVE_SPEED;
        if (keysPressed["ArrowRight"] || keysPressed["d"]) newVx = MOVE_SPEED;

        let newVy = v.y + GRAVITY;

        if (
          (keysPressed["ArrowUp"] || keysPressed["w"] || keysPressed[" "]) &&
          position.y >= FLOOR_Y
        ) {
          newVy = JUMP_FORCE;
        }

        return { x: newVx, y: newVy };
      });

      if (keysPressed["e"]) {
        setAnimationState("attack");
      } else if (position.y < FLOOR_Y) {
        setAnimationState("jump");
      } else if (velocity.x !== 0) {
        setAnimationState("run");
      } else {
        setAnimationState("idle");
      }

      if (velocity.x > 0) {
        setFacing("right");
      } else if (velocity.x < 0) {
        setFacing("left");
      }

      setPosition((p) => {
        const newX = p.x + velocity.x;
        let newY = p.y + velocity.y;

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

  const currentSprite =
    animationState === "attack"
      ? attackKnight
      : animationState === "jump"
        ? jumpKnight
        : animationState === "run"
          ? runKnight
          : idleKnight;

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

      <img
        alt={"knight"}
        src={currentSprite}
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
    </div>
  );
};
