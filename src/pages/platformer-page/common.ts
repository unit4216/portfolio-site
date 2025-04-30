import ground from "../../assets/DarkForest1.2/ground_tile.png";

export function generatePlatforms(
  startX: number,
  endX: number,
  step: number,
  y: number,
) {
  const platforms = [];

  for (let x = startX; x <= endX; x += step) {
    platforms.push({
      type: "ground",
      x,
      y,
      src: ground,
    });
  }

  return platforms;
}

export const PLATFORMS = generatePlatforms(0, 5000, 100, 600);

export enum AnimationState {
  ATTACK = "attack",
  JUMP = "jump",
  RUN = "run",
  IDLE = "idle",
  HURT = "hurt",
  DEAD = "dead",
}

export const GRAVITY = 0.5;
export const JUMP_FORCE = -12;
export const FLOOR_Y = 600;
