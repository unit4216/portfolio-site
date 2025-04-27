import ground from "../../assets/DarkForest1.2/ground_tile.png";

export const PLATFORMS = [
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

export enum AnimationState {
  ATTACK = "attack",
  JUMP = "jump",
  RUN = "run",
  IDLE = "idle",
  HURT = "hurt",
}

export const GRAVITY = 0.5;
export const JUMP_FORCE = -12;
export const FLOOR_Y = 600;
