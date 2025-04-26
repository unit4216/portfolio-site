import { useEffect, useRef, useState } from "react";
import idleKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Idle.png";
import attackKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_PNGSheets/_Attack.png";

export const PlatformerPage = () => {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {},
  );
  const requestRef = useRef<number>(0);

  const frameWidth = 164;
  const frameHeight = 128;
  const sheetWidth = frameWidth * 10;
  const sheetHeight = frameHeight * 1;

  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const MOVE_SPEED = 5;
  const FLOOR_Y = 400;

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

  return (
    <div className="relative w-screen h-screen bg-sky-300 overflow-hidden">
      <div
        className="absolute left-0 w-full bg-green-700"
        style={{ top: FLOOR_Y + 50, height: "100px" }}
      />
      <div
        className="absolute"
        style={{
          width: frameWidth + "px",
          height: frameHeight + "px",
          left: position.x,
          top: position.y,
          backgroundImage: `url(${keysPressed["e"] ? attackKnight : idleKnight})`,
          backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
