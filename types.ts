
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

export interface Firework {
  x: number;
  y: number;
  particles: Particle[];
}
