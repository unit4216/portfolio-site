import attackKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Attack.gif";
import jumpKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Jump.gif";
import runKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Run.gif";
import idleKnight from "../../assets/FreeKnight_v1/Colour1/Outline/120x80_gifs/__Idle.gif";

export enum AnimationState {
  ATTACK = "attack",
  JUMP = "jump",
  RUN = "run",
  IDLE = "idle",
}

export const Player = function ({
  animationState,
  position,
  facing,
}: {
  animationState: AnimationState;
  position: { x: number; y: number };
  facing: "left" | "right";
}) {
  const spriteMap: Record<AnimationState, string> = {
    [AnimationState.ATTACK]: attackKnight,
    [AnimationState.JUMP]: jumpKnight,
    [AnimationState.RUN]: runKnight,
    [AnimationState.IDLE]: idleKnight,
  };

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
